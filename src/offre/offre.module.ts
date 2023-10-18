import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviModule } from 'src/devise/devise.module';
import { portdeviseModule } from 'src/portedevise/portedevise.module';
import { portModule } from 'src/portefeuille/portefeuille.module';
import { UsersModule } from 'src/users/users.module';
import { OffreController } from './offre.controller';
import { Offre } from './offre.entity';
import { OffreService } from './offre.service';




@Module({
    imports: [TypeOrmModule.forFeature([Offre]),UsersModule,portdeviseModule,portModule,DeviModule],
    controllers: [
        OffreController,
    ],
    providers: [ OffreService],
    exports: [OffreService]

})
export class OffreModule {}