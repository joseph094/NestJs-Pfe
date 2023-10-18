import { Devise } from "src/devise/devise.entity";
import { PorteDevise } from "src/portedevise/portedevise.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'portefeuille' })
export class Portefeuille {
    @PrimaryGeneratedColumn("increment")
    public idp:number;

  
    @OneToOne(() => User, user=>user.portefeuille, { lazy: true ,onDelete:'CASCADE'  })
    @JoinColumn()
    user:User;

    @OneToMany((type) => PorteDevise, (portdevise) => portdevise.pt , { lazy: true  })
    public portdevises!: PorteDevise[];


    

     
}