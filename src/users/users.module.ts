import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { portModule } from 'src/portefeuille/portefeuille.module';
import { DeviModule } from 'src/devise/devise.module';
import { portdeviseModule } from 'src/portedevise/portedevise.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),forwardRef(()=>portModule),forwardRef(()=>DeviModule),forwardRef(()=>portdeviseModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}