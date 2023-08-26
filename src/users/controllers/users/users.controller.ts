import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
    // constructor(private )
    @Get('fetch')
    createUser(){
        return {username: 'Hamed', email:'hamedsedaghatqrpr83@gmail.com'}
    }

    @Get('')
    getUsersPosts() {
        return {message: 'hello'}
    }
}
