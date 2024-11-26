import { Response } from 'express';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
export declare class GoogleAuthController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    googleAuthCallback(code: string, res: Response): Promise<void>;
}
