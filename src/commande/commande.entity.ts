import { Offre } from "src/offre/offre.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'commande' })
export class Commande {
    @PrimaryGeneratedColumn("increment")
    ids:number;

    @Column()
    dateTrans:Date;

    @ManyToOne(() => User, user => user.commandes ,{lazy:true , eager:true})
    public Achateur: User;

    @OneToOne(type => Offre, { lazy: true ,cascade:true , eager:true })
    @JoinColumn()
    public offre:Offre;





}