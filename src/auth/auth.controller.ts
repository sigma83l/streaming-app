import { Body, Controller, Post, Res} from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { AuthService } from './auth.service'; 
import { SignUpDto } from './Dto/user-signUp.dto';
import { CookieOptions, Response } from 'express';

@Controller('auth')
export class authController {
    private readonly atExp = 15 * 60 * 1000; 
    private readonly rtExp = 7 * 24 * 60 * 60 * 1000; 
    constructor (private authService: AuthService){}
    private setCookie = (
    res: Response,
    name: string,
    value: string,
    maxAge: number,
    ) => {
        const cookieOptions: CookieOptions = {
            maxAge,
            httpOnly: true,
            domain: process.env.NODE_ENV === 'production'? '.stream-app.net' : '',
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : false,
        };
        res.cookie(name, value, cookieOptions)
    }
    @Public()
    @Post('signup')
    async signUp(
        @Body() signUpDto: SignUpDto,
        @Res({ passthrough: true }) res : Response 
    ) {
        const token = await this.authService.signUp()
    }

    async logout() {

    }
    async login() {

    }
}