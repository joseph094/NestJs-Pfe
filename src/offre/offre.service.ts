import { shallowEqualObjects } from "shallow-equal";
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Devise } from 'src/devise/devise.entity';
import { deviseService } from 'src/devise/devise.service';
import { PorteDeviService } from 'src/portedevise/portedevise.service';
import { portService } from 'src/portefeuille/portefeuille.service';
import { UsersService } from 'src/users/users.service';
import { Repository, UpdateResult, DeleteResult, getConnection, getManager } from 'typeorm';
import { CreateOffre } from './offre.dto';
import { Offre } from './offre.entity';
import { Commande } from "src/commande/commande.entity";

@Injectable()
export class OffreService {

    constructor(
        @InjectRepository(Offre) private readonly offreRepository: Repository<Offre>,
        private readonly usersService: UsersService,
        private readonly portedevise: PorteDeviService,
        private readonly porte: portService,
        private readonly devise: deviseService



    ) { }

    //retourner toutes les offres 
    async findAll(): Promise<Offre[]> {
        return await this.offreRepository.find();
    }//retourner les offres qui sont en cours 
    async findavailable() {
        return await this.offreRepository.find({ status: "en cours" })
    }
     //trouver offre a partir d ID
    async findOne(id: number): Promise<Offre> {
        return await this.offreRepository.findOne(id);
    }
    //Mettre à jour une  offre 
    async updateOne(offre: Offre): Promise<UpdateResult> {
        return await this.offreRepository.update(offre.ido, offre);
    }
    //Supprimer une offre
    async deleteOne(id: number): Promise<DeleteResult> {
        return await this.offreRepository.delete(id);
    }
    //retouner le vendeur de l'offre 
    async getuser(id: number) {
        const offre = await this.offreRepository.findOne(id);
        return offre.user;
    }

    // lancer une offre 
    async lancer(id: number, idb: number, idc: number, CreatedOfrre: CreateOffre): Promise<any> {

        
        const user = await this.usersService.findById(id);
        const portefeuille = await this.porte.findpotebyuser(user);
        //Retourner les offres de vendeur 
        const offreUser = await this.offreRepository.find({ user: user });
        const porte_devise = await this.portedevise.verifporte(portefeuille.idp, idb);
        
        const devisequote = await this.devise.findOne(idc);

        const devisebase = await this.devise.findOne(idb);
        var disponible = 0;
        //calcul de la quantite de devise base dans des offres precedentes  
        for (var i = 0; i < offreUser.length; i++) {
            var d = await this.basedevise(offreUser[i].ido);

            if ((d.idc == devisebase.idc) && (offreUser[i].status != "valide")) {
                var disponible = disponible + offreUser[i].quantite;
            }


        }
        const dispo = disponible + CreatedOfrre.quantite;
        //verifier la disponibilite de la quantite à vendre 
        if (dispo > porte_devise.Qte) {
            throw new HttpException(
                'vous navez pas le montant que vous désirez vendre',
                HttpStatus.BAD_REQUEST)
        } 
        else {

            const deal = new Offre();
            deal.quantite = CreatedOfrre.quantite;
            deal.status = CreatedOfrre.status;
            deal.valeur = CreatedOfrre.valeur;
            deal.user = user;
            deal.devibase = devisebase;
            deal.devicur = devisequote;
            deal.commande = null;

            let offre = await this.offreRepository.create(deal);
            await this.offreRepository.save(offre);
            return offre;
        }

    }
    //retouner la devise base d'une offre 
    async basedevise(id: number): Promise<Devise> {
        const offre = await this.offreRepository.findOne(id);
        return offre.devibase;
    }
    //retourner la devise quote d' une offre 
    async quotedevise(id: number): Promise<Devise> {
        const offre = await this.offreRepository.findOne(id);
        return offre.devicur;
    }
    //affecter une offre à une commande 
    async effectCommande(Offre: Offre, commande: Commande): Promise<any> {
        this.offreRepository.update(Offre.ido, { commande: commande, status: "valide" });
    }
    //retourner le nombres des offres 
    public async numberOffres(): Promise<Number> {

        const entityManager = getManager();
        const results = await entityManager.query(`SELECT Count(*) X FROM OFFRE `);
        var data = results;
        var Number_Offre_Json = JSON.stringify(data[0].X);
        var Number_Offre_int = JSON.parse(Number_Offre_Json);

        return Number_Offre_int;
    }
    //retourner le nombre des commandes 
    public async Commandes(): Promise<Number> {

        const entityManager = getManager();
        const results = await entityManager.query(`SELECT Count(*) X FROM OFFRE WHERE STATUT="valide" `);
        var data = results;
        var Number_Offre_Valide_J = JSON.stringify(data[0].X);
        var Number_Offre_Valide_Int = JSON.parse(Number_Offre_Valide_J);

        return Number_Offre_Valide_Int;
    }
    //retourner la somme des offres en dinar tunisien 
    public async SumCommande(): Promise<Number> {

        const entityManager = getManager();
        const results = await entityManager.query(`SELECT SUM(valeur) X FROM OFFRE WHERE STATUT="valide" AND DeviseQuote=1  `);
        var data = results;
        var Somme_Transactins_Dt = JSON.stringify(data[0].X);
        var Somme_Transactins_Dt_float = JSON.parse(Somme_Transactins_Dt);

        return Somme_Transactins_Dt_float;
    }
    //retourner les offres d un utilisateur  
    public async offres_user(id: number) {
        const user = await this.usersService.findById(id);
        return this.offreRepository.find({ user: user });
    }

}