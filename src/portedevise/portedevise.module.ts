import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { portdeviseController } from './portedevise.controller';
import { PorteDevise } from './portedevise.entity';
import { PorteDeviService } from './portedevise.service';




@Module({
    imports: [TypeOrmModule.forFeature([PorteDevise]),forwardRef(()=>UsersModule)],
    controllers: [
        portdeviseController,
    ],
    providers: [ PorteDeviService],
    exports: [PorteDeviService],

})
export class portdeviseModule {}