import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LoginUserDto } from 'src/auth/login.dto';
import { CreateUserDto } from './users.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userservice: UsersService) { }
    @Get()
    all() {
        return this.userservice.findAll();
    }
    @Get(':id')
    getone(@Param('id') id: number) {
        return this.userservice.findById(id);
    }
    @Delete(':idc')
    deleteOne(@Param('idc') id: number) {
        return this.userservice.delete(id);
    }
    @Get('/number/All')
    numbreusers() {
        return this.userservice.numberUsers();
    }
    @Patch(':id')
    update(@Param('id') id: number, @Body() user: CreateUserDto) {
        return this.userservice.update(id, user);
    }
    @Post('/loginadmin')
    loginadmin(@Body() login: LoginUserDto) {
        return this.userservice.login_admin(login)
    }
}