import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Devise } from 'src/devise/devise.entity';
import { RemplirPortefeuille } from 'src/portefeuille/portefeuille.dto';
import { Portefeuille } from 'src/portefeuille/portefeuille.entity';
import { UsersService } from 'src/users/users.service';
import { createQueryBuilder, getConnection, getRepository, Repository } from 'typeorm';
import { PorteDevise } from './portedevise.entity';

@Injectable()
export class PorteDeviService { 
    constructor(
        @InjectRepository(PorteDevise) private readonly portdevi: Repository<PorteDevise>,
        @Inject(forwardRef(() => UsersService))//<--- here
        private readonly userservice: UsersService,
        

    ) {}
    //Verifier devise dans portefeuille
    async verifporte(porteId: number,deviseId:number): Promise<PorteDevise>{
           const portefeuille =await this.portdevi.find({porteId:porteId});
          for(var j=0; j<portefeuille.length; j++){
              if((portefeuille[j].deviseId==deviseId)&&(portefeuille[j].porteId==porteId)){
                  return portefeuille[j];
              }
          } 
}        
                              
    //retourner les informations des devises d un portefeuille 
    public async findAl(id:number): Promise<PorteDevise[]> {
        
    return await this.portdevi.find({porteId:id});

    }
    //creation d un lien entre une devise et un portefeuille 
    public async create (port :PorteDevise):Promise<PorteDevise>{
      return  await this.portdevi.save(port);
    }
    //initialiser une devise dans un portefeuille
    public async initialize(port:Portefeuille,dev:Devise){
        return await this.portdevi.create({
            porteId:port.idp,
            deviseId:dev.idc,
            Qte:0,
        })
    }
}