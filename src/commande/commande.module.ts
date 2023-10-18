import { forwardRef, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviModule } from 'src/devise/devise.module';
import { OffreModule } from 'src/offre/offre.module';
import { portdeviseModule } from 'src/portedevise/portedevise.module';
import { portModule } from 'src/portefeuille/portefeuille.module';
import { UsersModule } from 'src/users/users.module';
import { CommandeController } from './commande.controller';
import { Commande } from './commande.entity';
import { CommandeService } from './commande.service';

@Module({
    imports: [TypeOrmModule.forFeature([Commande]),UsersModule,portdeviseModule,portModule,OffreModule,forwardRef(()=>DeviModule)
    ],
    controllers: [
        CommandeController,
    ],
    providers: [
        CommandeService,
    ],
    exports:[
        CommandeService
    ]
})
export class CmdModule {}