import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PorteDevise } from 'src/portedevise/portedevise.entity';
import { PorteDeviService } from 'src/portedevise/portedevise.service';
import { portService } from 'src/portefeuille/portefeuille.service';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Devise } from './devise.entity';

@Injectable()
export class deviseService {

    constructor(
        @InjectRepository(Devise) private readonly deviseRepository: Repository<Devise>,
        @Inject(forwardRef(() => portService))//<--- here
        private readonly Portefeuilleservices: portService,
        @Inject(forwardRef(() => PorteDeviService))//<--- here
        private readonly portedevise: PorteDeviService,


    ) {}
    //retourner toutes les devises 
    async findAll(): Promise<Devise[]> {
        return await this.deviseRepository.find();
    }
    //retourner une devise à partir d ID
    async findOne(id: number): Promise<Devise> {
        return await this.deviseRepository.findOne(id);
    }
    //insertion d'une nouvelle devise 
    async insertOne(devise: Devise): Promise<Devise> {
        const dev= await this.deviseRepository.save(devise);
        const portefeuilles = await this.Portefeuilleservices.findAll();
        for(var i=0;i<portefeuilles.length;i++){
           var portedevise = new PorteDevise();
           portedevise.porteId=portefeuilles[i].idp;
           portedevise.deviseId=dev.idc;
           portedevise.Qte=0;
           await this.portedevise.create(portedevise);
        }
        return dev

    }
    //Mettre à jour une devise 
    async updateOne(devise: Devise): Promise<UpdateResult> {
        return await this.deviseRepository.update(devise.idc, devise);
    }
    //Supprimer une devise 
    async deleteOne(id: number): Promise<DeleteResult> {
        return await this.deviseRepository.delete(id);
    }
    
   
}