export type RefreshJwtPayload = {
    sub: number;
    name: string;
    role: string;
    refreshToken: string;
}