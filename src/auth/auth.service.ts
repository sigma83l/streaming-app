import { 
    Injectable,  

} from '@nestjs/common';
import { SignUpDto } from './Dto/user-signUp.dto';
import { Tokens } from './types/tokens.type';
import { AuthRepository } from './auth.repository';
import { Hash } from 'src/common/utils/';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
    ){}

    async signUp(signUpDto: SignUpDto): Promise<Tokens>{
    

    const hashedPassword = await Hash.hash(signUpDto.password)
    const user = await this.userRepository.create
    }
    async login() {

    }
    async logout() {

    }
}
