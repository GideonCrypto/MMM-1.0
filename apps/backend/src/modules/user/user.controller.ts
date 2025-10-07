import { Body, Controller, Get, InternalServerErrorException, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { CreateUserDto, GetUserDto } from './dto/user.dto';

@Controller("user")
export class UserController {
    constructor(private readonly service: UserService) {}

    @Post('createUser')
    @ApiOkResponse({
            description: 'Success',
            type: [CreateUserDto],
        })
    createUser(@Body() createUserDto: CreateUserDto) {
        try {
            return this.service.createUser(createUserDto);
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Post('getUser')
    @ApiOkResponse({
            description: 'Success',
            type: [GetUserDto],
        })
    getUser(@Body() getUserDto: GetUserDto) {
        try {
            return this.service.getUser(getUserDto);
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}
