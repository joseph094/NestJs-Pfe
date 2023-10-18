import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { portdeviseModule } from './portedevise/portedevise.module';
import { portModule } from './portefeuille/portefeuille.module';
import { OffreModule } from './offre/offre.module';
import { CmdModule } from './commande/commande.module';
import "reflect-metadata";



@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'laevitas',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true}), AuthModule, UsersModule,portdeviseModule,portModule,OffreModule,CmdModule],
  controllers: [AppController],
  providers: [AppService],
  exports:[AppService]
})
export class AppModule {}