import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { pseudoRandomBytes } from "crypto";
import { Devise } from "./devise.entity";
import { deviseService } from "./devise.service";

@Controller("devise")
export class deviController {
    constructor(private deviseservice:deviseService){}

@Get()
all() {
    return this.deviseservice.findAll();
}

@Get(':idc')
findOne(@Param('idc') id: number) {
    return this.deviseservice.findOne(id);
}

@Post()
insertOne(@Body() devise: Devise) {
    return this.deviseservice.insertOne(devise);
}

@Put()
updateOne(@Body() devise: Devise) {
    return this.deviseservice.updateOne(devise);
}

@Delete(':idc')
deleteOne(@Param('idc') id: number) {
    return this.deviseservice.deleteOne(id);
}
}