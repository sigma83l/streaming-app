import { 
    Injectable,
    ExecutionContext,
    HttpException,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtGuard extends AuthGuard('jwt'){
    constructor(private reflector: Reflector){
        super()
    }

    canActivate(context: ExecutionContext){
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        return super.canActivate(context);
    }
    handleRequest(err, user, info: Error) {
        if (err || info) throw new HttpException("", 489);
        if (!user) throw new UnauthorizedException('Access Denied.');
        return user;
    }
}