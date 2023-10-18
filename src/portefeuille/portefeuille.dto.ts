import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.entity';

export class CreatePortefeuille {
    @ApiProperty()
    readonly id: number;
    @ApiProperty()
    user:User;
}
export class RemplirPortefeuille{
    @ApiProperty()
    deviseId:number;
    @ApiProperty()
    quantite:number;
}