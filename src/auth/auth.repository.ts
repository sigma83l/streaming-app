import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationDto } from './Dto/user-signUp.dto';
import { Verification } from '@prisma/client';

@Injectable()
export class AuthRepository {
    constructor(private readonly prisma: PrismaService) {}

    async upsertVerification(
        user: VerificationDto,
        code: string,
    ): Promise<Verification> {
        return this.prisma.verification.upsert({
            where: { email: user.email },
            create: {
                email: user.email,
                code: code,
                lastResendTime: new Date().toISOString(),
            },
            update: {
                try: { increment: 1 },
                lastResendTime: new Date().toISOString(),
                code: code,
            },
        });
    }

    findVerification(email: string): Promise<Verification>{
        return this.prisma.verification.findFirst({ where: { email }});
    }
}