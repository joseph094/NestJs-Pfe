import { ApiProperty } from '@nestjs/swagger';
import { Commande } from 'src/commande/commande.entity';
import { Devise } from 'src/devise/devise.entity';
import { User } from 'src/users/users.entity';

export class CreateOffre {
    @ApiProperty()
    readonly ido: number;

    @ApiProperty()
    readonly status: string;

    @ApiProperty()
    readonly quantite: number;

    @ApiProperty()
    readonly valeur: number;
    @ApiProperty()
    devibase : Devise;

    @ApiProperty()
    devicur: Devise;

    @ApiProperty()
     user: User;

    @ApiProperty()
     commande: Commande;


    
}