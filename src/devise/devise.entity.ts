import { Offre } from "src/offre/offre.entity";
import { PorteDevise } from "src/portedevise/portedevise.entity";
import { Portefeuille } from "src/portefeuille/portefeuille.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'devise' })
export class Devise {
    @PrimaryGeneratedColumn("increment")
    idc:number;

    @Column({name:"nom"})
    name:string;
    
    @OneToMany((type) => PorteDevise, (portdevise) => portdevise.devise, { lazy: true })
    public portdevises!: PorteDevise[];

    @OneToMany(() => Offre, offre => offre.devicur, { lazy: true })
  offrecur: Offre[];

  @OneToMany(() => Offre, offre => offre.devibase, { lazy: true })
  offrebase: Offre[];





}