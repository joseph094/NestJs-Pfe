import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { RemplirPortefeuille } from "./portefeuille.dto";
import { Portefeuille } from "./portefeuille.entity";
import{ portService} from "./portefeuille.service";

@Controller("portefeuille")
export class portController {
    constructor(private port:portService){}
@Get(':id')
find(@Param('id') id : number){
    return this.port.findOne(id);
}
@Post('/remplir/:id')
remplir(@Param('id') id:number,@Body() remplirdto:RemplirPortefeuille){
return this.port.remplir(id,remplirdto);
}
@Get()
all() {
    return this.port.findAll();
}

@Get('/users/:userId')
findOne(@Param('userId') id: number) {
    return this.port.consult(id);
}

@Post()
insertOne(@Body() porte: Portefeuille) {
    return this.port.insertOne(porte);
}

@Put()
updateOne(@Body() porte: Portefeuille) {
    return this.port.updateOne(porte);
}

@Delete(':idp')
deleteOne(@Param('idp') id: number) {
    return this.port.deleteOne(id);
}
}