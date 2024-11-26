import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    validateToken(token: string): Promise<{
        valid: boolean;
    }>;
}
