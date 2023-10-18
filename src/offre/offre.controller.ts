import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateOffre } from "./offre.dto";
import { Offre } from "./offre.entity";
import { OffreService } from "./offre.service";

@Controller("Offre")
export class OffreController {
    constructor(private offreservice:OffreService){}
 @Post(':userId/:devibaseId/:devicurId')
 async lanc(@Param('userId') iduser :number,@Param('devicurId') idquote :number,@Param('devibaseId') idbase :number,@Body() offre: CreateOffre){
     return this.offreservice.lancer(iduser,idbase,idquote,offre);
 }
 @Get()
 async findall(){
     return this.offreservice.findAll();
 }
 @Get('/number')
numbreOffres(){
    return this.offreservice.numberOffres();
}
@Get('/numbervalide')
numbreCommande(){
    return this.offreservice.Commandes();
}

@Get('/sommecommande')
sumcommande(){
    return this.offreservice.SumCommande();
}
@Delete(':id')
deleteOffe(@Param('id') id: number){
    return this.offreservice.deleteOne(id); 
}
@Get('/disponibles')
offres_dispo(){
    return this.offreservice.findavailable();
}
@Get('/user/:id')
offre_user(@Param('id') id:number){
    return this.offreservice.offres_user(id);
}
@Patch('/update')
update(@Body() offre:Offre){
    return this.offreservice.updateOne(offre);
}


 }

