import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { portdeviseModule } from 'src/portedevise/portedevise.module';
import { portController } from './portefeuille.controller';
import { Portefeuille } from './portefeuille.entity';
import { portService } from './portefeuille.service';
import "reflect-metadata";
import { UsersModule } from 'src/users/users.module';


@Module({
    imports: [TypeOrmModule.forFeature([Portefeuille]),forwardRef(()=>UsersModule),portdeviseModule
    ],
    controllers: [
        portController,
    ],
    providers: [
        portService
    ],
    exports:[portService]
})
export class portModule {}