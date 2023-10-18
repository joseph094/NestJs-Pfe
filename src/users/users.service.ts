import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { deviseService } from 'src/devise/devise.service';
import { PorteDeviService } from 'src/portedevise/portedevise.service';
import { CreatePortefeuille } from 'src/portefeuille/portefeuille.dto';
import { portService } from 'src/portefeuille/portefeuille.service';
import { Repository, DeleteResult } from 'typeorm';
import { CreateUserDto } from './users.dto';
import { User } from './users.entity';
import { getManager } from "typeorm";
import * as bcrypt from 'bcrypt';
import * as bycrypt from 'bcrypt';
import { LoginUserDto } from 'src/auth/login.dto';
import * as jwt from 'jsonwebtoken';



@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => portService))//<--- here
    private readonly portfeuilleservice: portService,
    @Inject(forwardRef(() => deviseService))//<--- here
    private readonly deviseservice: deviseService,
    @Inject(forwardRef(() => PorteDeviService))//<--- here
    private readonly portdeviservice: PorteDeviService,


  ) { }
  public async utilisateur(user: User): Promise<User> {
    return await this.userRepository.findOne(user);
  }
// Retourner tous les utilisateurs 
  public async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
// Retourner un utilisateur par son email 
  public async findByEmail(userEmail: string): Promise<User | null> {
    return await this.userRepository.findOne({ email: userEmail });
  }
// // Retourner un utilisateur par ID 
  public async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOneOrFail(id);
  }
// Creation d instance d'utilisateur 
  public async create(user: CreateUserDto): Promise<User> {
    return await this.userRepository.save(user);
  }
// Mettre a jour les informations d'un utilisateur 
  public async update(
    id: number,
    newValue: CreateUserDto,
  ): Promise<User | null> {
    const user = await this.userRepository.findOneOrFail(id);
    if (!user.id) {
      console.error("user doesn't exist");
    }
  if (newValue.password!=user.password){
      // Hachage du mot de passe avant la mise a jour
    newValue.password = bcrypt.hashSync(newValue.password, 2)
  }
    return await this.userRepository.save(newValue);
  }
     //supprimer un utilisateur a partir de ID
  public async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
    // Inscrire un nouvel utilisateur 
  public async register(userDto: CreateUserDto): Promise<any> {
    const { email } = userDto;
    let user = await this.userRepository.findOne({ where: { email } });
    //verifier si l email est deja existant 
    if (user) {
      throw new HttpException(
        'Email Deja existant ',
        HttpStatus.BAD_REQUEST,
      );
    }
    //Creation d' un portefeuille 
    const portefeuille = new CreatePortefeuille();
    let porte = await this.portfeuilleservice.create(portefeuille);
    await this.portfeuilleservice.insertOne(porte);
    //Creation d utilisateur 
    user = await this.userRepository.create(userDto);
    user = await this.userRepository.save(user);
    //affecter la portefeuille a l utilisateur 
    await this.userRepository.update(user.id, { portefeuille: porte });
    await this.portfeuilleservice.setuser(porte, user);
    //initialisation de portefeuille à partir de  la liste des devises 
    const nbrdevises = await this.deviseservice.findAll();

    for (var i = 0; i < nbrdevises.length; i++) {
      const get_devise = await this.deviseservice.findOne(nbrdevises[i].idc);
      if (get_devise) {
        const portedevise = await this.portdeviservice.initialize(porte, get_devise);
        await this.portdeviservice.create(portedevise);
      }

    }

    return JSON.stringify(user);



  }
  //Retourner le nombre des utilisateurs 
  public async numberUsers(): Promise<Number> {

    const entityManager = getManager();
    const results = await entityManager.query(`SELECT Count(*) X FROM USER `);
    var data = results;
    var NombreUsersJson = JSON.stringify(data[0].X);
    var NombreUsersInt = JSON.parse(NombreUsersJson);

    return NombreUsersInt;
  }
  // Connexion admin 
  public async login_admin(login: LoginUserDto) {
    if (login.email === "admin@admin.com") {
      const user = await this.userRepository.findOne({ email: login.email });
      if (user && bycrypt.compareSync(login.password, user.password)) {
        //creation de token 
        const accessToken = jwt.sign(
          { 
            id:user.id,
            firstName:user.firstName,
            lastName:user.lastName,
            email: user.email,
          },
          'Codebrains',
          { expiresIn: 3600 },
        );
        return {accessToken};
      }
      else return false;



    }

  }
}