import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { portdeviseModule } from 'src/portedevise/portedevise.module';
import { portModule } from 'src/portefeuille/portefeuille.module';
import { deviController } from './devise.controller';
import { Devise } from './devise.entity';
import { deviseService } from './devise.service';

@Module({
    imports: [TypeOrmModule.forFeature([Devise]),forwardRef(()=>portdeviseModule),forwardRef(()=>portModule)
    ],
    controllers: [
        deviController,
    ],
    providers: [
        deviseService,
    ],
    exports: [deviseService]
})
export class DeviModule {}