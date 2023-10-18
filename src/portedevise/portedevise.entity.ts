import { Devise } from "src/devise/devise.entity";
import { Portefeuille } from "src/portefeuille/portefeuille.entity";
import { PrimaryGeneratedColumn } from "typeorm";
import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn, ManyToOne } from "typeorm";


@Entity()
export class PorteDevise {
@PrimaryColumn()
public porteId:number;
@ManyToOne(() => Portefeuille , pt => pt.portdevises , {cascade:true})
@JoinColumn({name:"porteId"})
 pt : Portefeuille;

@PrimaryColumn()
deviseId:number;
@ManyToOne(() => Devise , dv => dv.portdevises,{cascade:true ,eager:true ,onDelete:"CASCADE"    })
 @JoinColumn({name:"deviseId"})
  devise : Devise;

@Column('float')
Qte:number;
}