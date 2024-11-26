import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    generateToken(payload: {
        id: string;
        email: string;
    }): string;
    validateToken(token: string): boolean;
}
