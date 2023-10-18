import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PorteDeviService } from 'src/portedevise/portedevise.service';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository, UpdateResult, DeleteResult, getConnection } from 'typeorm';
import { Portefeuille } from './portefeuille.entity';
import "reflect-metadata";
import { CreatePortefeuille, RemplirPortefeuille } from './portefeuille.dto';
import { PorteDevise } from 'src/portedevise/portedevise.entity';

@Injectable()
export class portService {

    constructor(
        @InjectRepository(Portefeuille) private readonly portrepo: Repository<Portefeuille>,
        @Inject(forwardRef(() => UsersService))//<--- here
        private readonly usersService: UsersService,
                private readonly portedevise: PorteDeviService,

    ) {}
    //retourner portefeuille a partir de l'utlisateur
    async findpotebyuser(use: User):Promise<Portefeuille>{
        return this.portrepo.findOne({user:use});
    }
    //retourner tous les portefeuilles
    async findAll(): Promise<Portefeuille[]> {
        return await this.portrepo.find();
    }
    //retourner portefeuille 
    async consult(id:number):Promise<any>{
        const user = await this.usersService.findById(id);
        const  porte = await this.findpotebyuser(user);
      return this.portedevise.findAl(porte.idp);
    }
     //retourner portefeuille a partir ID 
    async findOne(id: number): Promise<User> {
        const portefeuille =  await this.portrepo.findOne(id);
        return portefeuille.user;
    }
    // Inserer  portefeuille 
    async insertOne(port: Portefeuille): Promise<Portefeuille> {
        return await this.portrepo.save(port);
    }
    // Mettre a jour un portefeuille 
    async updateOne(port: Portefeuille): Promise<UpdateResult> {
        return await this.portrepo.update(port.idp, port);
    }
     //Supprimer un portefeuille
   async deleteOne(id: number): Promise<DeleteResult> {
        return await this.portrepo.delete(id);
    } // create portefeuille
    async create(port: CreatePortefeuille):Promise<Portefeuille>{
        return await this.portrepo.create(port);
    }
    //affecter portefeuille a un utilisateur 
    async setuser(port:Portefeuille, user:User){
        return await this.portrepo.update(port.idp,{user:user});
    }
    //remplir portefeuille 
    async remplir(id:number, remplir:RemplirPortefeuille){
        const user= await this.usersService.findById(id);
        const portefeuille = await this.findpotebyuser(user);
        const portedevise = await this.portedevise.verifporte(portefeuille.idp,remplir.deviseId);
        await getConnection().createQueryBuilder().update(PorteDevise)
          .set({Qte:(portedevise.Qte+remplir.quantite)}).where("porteId= :id",{id:portefeuille.idp})
          .andWhere("deviseId= :id1",{id1:remplir.deviseId}).execute();   

        return portedevise.Qte;
    }
      
   
}