import { type } from "node:os";
import { Commande } from "src/commande/commande.entity";
import { Devise } from "src/devise/devise.entity";
import { User } from "src/users/users.entity";
import { Column, Double, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Offre {
  @PrimaryGeneratedColumn()
  ido: number;

  @Column({name:"statut"})
  status: string;

 @Column('float')
 quantite: number;

 @Column('float')
 valeur: number;

 @ManyToOne(() => Devise, cur => cur.offrecur, { lazy: true , eager:true} )
 @JoinColumn({name:"DeviseQuote"})
 devicur: Devise ;


 @ManyToOne(() => Devise, base => base.offrebase, { lazy: true , eager:true})
 @JoinColumn({name:"DeviseBase"})
 devibase: Devise;


  @ManyToOne(() => User, user => user.offres, { lazy: true , eager:true , onDelete:'CASCADE' , onUpdate:'CASCADE' })
  user: User;

  @OneToOne(type => Commande, { lazy: true , onDelete:'CASCADE' ,onUpdate:'CASCADE' })
    @JoinColumn()
    commande:Commande;
}
