import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Commande } from "./commande.entity";
import { CommandeService } from "./commande.service";


@Controller("commande")
export class CommandeController {
    constructor(private commandeservice:CommandeService){}

@Get()
all() {
    return this.commandeservice.findAll();
}
@Get('user/:id')
commandes_user(@Param('id') id:number  ){
    return this.commandeservice.commandes_user(id);
}

@Get('port/:idu')
get(@Param('idu') idu:number){
    return this.commandeservice.validation( idu );
}

@Get(':ids')
findOne(@Param('ids') id: number) {
    return this.commandeservice.findOne(id);
}

@Post(':achateurId/:offreido')
insertOne(@Param('achateurId') idu:number ,@Param('offreido') id:number) {
    return this.commandeservice.accepter(idu,id);
}

@Put()
updateOne(@Body() cmd: Commande) {
    return this.commandeservice.updateOne(cmd);
}

@Delete(':ids')
deleteOne(@Param('ids') id: number) {
    return this.commandeservice.deleteOne(id);
}
@Get('/stat/mois')
stat(){
    return this.commandeservice.stat_mois();
}
}