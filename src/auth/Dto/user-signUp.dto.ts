import 
    { 
    IsEmail, 
    IsNotEmpty,
    MaxLength, 
    MinLength,
    IsString,
    IsDateString,
    Validate
} from 'class-validator';
import { Transform } from 'class-transformer'; 
import { CustomMatchPasswords } from 'src/common/utils/password.utils';

export class SignUpDto {

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    email: string;

    @IsDateString()
    @IsNotEmpty()
    dateOfBirth: Date;

    @IsNotEmpty()
    @IsString()
    @MinLength(50, { message: "Password is less than the minlength" })
    @MaxLength(50, { message: "Password exceeded the maxlength" })
    password: string;

    @Validate(CustomMatchPasswords, ['password'])
    passwordConfirm: string;
}
export class VerificationDto {
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value.toLowerCase())
    email: string;
}