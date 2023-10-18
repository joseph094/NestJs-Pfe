import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    OneToMany,
    JoinColumn,
    OneToOne,
    BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import "reflect-metadata";
import { UserRO } from './users.ro';
import { Portefeuille } from 'src/portefeuille/portefeuille.entity';
import { Offre } from 'src/offre/offre.entity';
import { Commande } from 'src/commande/commande.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:"prenom"})
  firstName: string;

  @Column({name:"nom"})
  lastName: string;

  @Column({name:"email"})
  email: string;

  @Column({name:"mdp"})
  password: string;
  @BeforeUpdate()
  async hash()
  {this.password =  bcrypt.hashSync(this.password, 2)}
  @BeforeInsert()
  async hashPassword() {
    this.password =  bcrypt.hashSync(this.password, 2);
  }
  toResponseObject(showToken: boolean = true): UserRO {
    const { id, firstName, lastName, email } = this;
    const responseObject: UserRO = {
      id,
      firstName,
      lastName,
      email,
    };

    return responseObject;
  }
  
  @OneToOne(() => Portefeuille, Portefeuille=>Portefeuille.user, {eager:true, lazy: true,cascade:true,onDelete:'SET NULL' ,onUpdate:'CASCADE' })
    @JoinColumn({name:"portefeuilleidp"})
    portefeuille:Portefeuille;
     
  @OneToMany(() => Offre, offre => offre.user, { lazy: true,cascade:true})
  offres: Offre[];

  @OneToMany(() => Commande, commande => commande.Achateur, { cascade:true})
  commandes: Commande[];
  
}
