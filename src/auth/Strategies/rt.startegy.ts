import { PassportStrategy } from "@nestjs/passport"; 
import { JwtPayload } from '../types/index';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from 'express';
import { RefreshJwtPayload } from "../types/jwtPayload.rt";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy, 
    'jwt-refresh'
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req:Request) => this.jwtExtractor(req),
            ]),
            ignoreExpiration:false,
            secretOrKey: process.env.SECRET_KEY,
        })
    }
    validate(req: Request, payload: JwtPayload): RefreshJwtPayload {
        const refreshToken = this.jwtExtractor(req)

        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

        return { 
            sub: payload.sub, 
            role: payload.role, 
            name: payload.name,
            refreshToken,
        };
    }

    jwtExtractor(req:Request){
        const token = req?.cookies['refresh_token'];
        if (!token) return null;

        return token;
    }

}