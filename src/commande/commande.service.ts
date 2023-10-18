import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { deviseService } from 'src/devise/devise.service';
import { Offre } from 'src/offre/offre.entity';
import { OffreService } from 'src/offre/offre.service';
import { PorteDevise } from 'src/portedevise/portedevise.entity';
import { PorteDeviService } from 'src/portedevise/portedevise.service';
import { portService } from 'src/portefeuille/portefeuille.service';
import { UsersService } from 'src/users/users.service';
import { Repository, UpdateResult, DeleteResult, getConnection, getManager } from 'typeorm';
import { Commande } from './commande.entity';

@Injectable()
export class CommandeService {
      love=new Array();

    constructor(
        @InjectRepository(Commande) private readonly cmdRepository: Repository<Commande>,
        private readonly userservice: UsersService,
        private readonly offreservice: OffreService,
        private readonly portedevise: PorteDeviService,
        private readonly portefeuille: portService,
        private readonly deviseservice:deviseService


    

    ) { }
    //retourner toutes les commandes 
    async findAll(): Promise<Commande[]> {
        return await this.cmdRepository.find();
    }
    //retourner une commande à partir ID
    async findOne(id: number): Promise<Commande> {
        return await this.cmdRepository.findOne(id);
    }
    //Insertion d une nouvelle commade 
    async insertOne(cmd: Commande): Promise<Commande> {
        return await this.cmdRepository.save(cmd);
    }
    //Mettre à jour une commande 
    async updateOne(cmd: Commande): Promise<UpdateResult> {
        return await this.cmdRepository.update(cmd.ids, cmd);
    }
    //suppriler une commande 
    async deleteOne(id: number): Promise<DeleteResult> {
        return await this.cmdRepository.delete(id);
    }
    //Acheter une commande 
    async accepter(iduser: number, idoffre: number): Promise<any> {
        //Recuperation de l offre souhaitée
        const user = await this.userservice.findById(iduser);
        const offre = await this.offreservice.findOne(idoffre );
        const portefeuil = await this.portefeuille.findpotebyuser(user);
        //Recuperatin de devise base et la Qte 
        const devisebase = await this.offreservice.basedevise(idoffre);
        const portefeuille_devisebase = await this.portedevise.verifporte(portefeuil.idp, devisebase.idc);

        const quotedevise = await this.offreservice.quotedevise(idoffre);
        const portefeuille_devisequote = await this.portedevise.verifporte(portefeuil.idp, quotedevise.idc);


        //Verifier si l'offre est encore disponible 
         if (offre.status == "valide") {
            throw new HttpException(
                'Cette Offre est deja vendue ',
                HttpStatus.BAD_REQUEST)
            //Verifier la disponibilite du montant (Acheteur)
        } else if (portefeuille_devisequote.Qte < offre.valeur) {
            throw new HttpException(
                'vous n avez pas les moyens de payer',
                HttpStatus.BAD_REQUEST)

        } 
         await getConnection().createQueryBuilder().update(PorteDevise)
        .set({ Qte: (portefeuille_devisebase.Qte + offre.quantite) }).where("porteId= :idc", { idc: portefeuille_devisebase.porteId })
         .andWhere("deviseId= :idb", { idb: portefeuille_devisebase.deviseId }).execute();
        
        //Mise à jour de portefeuille(vendeur+Acheteur) 
        const vendeur = await this.offreservice.getuser(idoffre);
        const portefeuille = await this.portefeuille.findpotebyuser(vendeur);
        const y = await this.portedevise.verifporte(portefeuille.idp, devisebase.idc);
        const o = await this.portedevise.verifporte(portefeuille.idp, quotedevise.idc);
        const commande = new Commande();
        commande.Achateur = user;
        commande.offre = offre;
        commande.dateTrans = new Date(Date.now());
        await getConnection().createQueryBuilder().update(PorteDevise)
            .set({ Qte: (y.Qte - offre.quantite) }).where("porteId= :id", { id: y.porteId })
            .andWhere("deviseId= :id1", { id1: y.deviseId }).execute();

        await getConnection().createQueryBuilder().update(PorteDevise)
            .set({ Qte: (o.Qte + offre.valeur) }).where("porteId= :id", { id: o.porteId })
            .andWhere("deviseId= :id1", { id1: o.deviseId }).execute();

        await getConnection().createQueryBuilder().update(PorteDevise)
            .set({ Qte: (portefeuille_devisequote.Qte - offre.valeur) }).where("porteId= :id", { id: portefeuille_devisequote.porteId })
            .andWhere("deviseId= :id1", { id1: portefeuille_devisequote.deviseId }).execute();

        await this.cmdRepository.create(commande);
        await this.cmdRepository.save(commande);
        await this.offreservice.effectCommande(offre, commande);
        return commande;

    }

    async validation(idu: number): Promise<any> {
        const vendeur = await this.offreservice.getuser(idu);
        return vendeur;


    }
    // Somme des transactions en TND par mois 
    async stat_mois(): Promise<any> {
        const entityManager = getManager();
        const Transactions_Par_Mois = await entityManager.query(`SELECT SUM(valeur) SOMME , monthname(dateTrans) MOIS FROM COMMANDE , OFFRE WHERE OFFRE.ido = COMMANDE.offreIdo AND OFFRE.DeviseQuote=1 GROUP BY monthname(dateTrans) ORDER BY month(dateTrans) `);
        return Transactions_Par_Mois;
    }

    //les commandes d un utilisateur donné 
    async commandes_user(id: number) {
        const user = await this.userservice.findById(id);
        return await this.cmdRepository.find({ Achateur: user });

    } 

}
