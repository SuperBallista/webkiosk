"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const user_service_1 = require("../../user/user.service");
const auth_service_1 = require("../auth.service");
let GoogleAuthController = class GoogleAuthController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async googleAuthCallback(code, res) {
        if (!code) {
            console.error('Missing required parameter: code');
            return res.redirect('/error');
        }
        try {
            const tokenResponse = await axios_1.default.post('https://oauth2.googleapis.com/token', {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: 'http://localhost:5000/auth/google/callback',
                grant_type: 'authorization_code',
                code,
            });
            const userInfo = await axios_1.default.get('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
            });
            const { email } = userInfo.data;
            const user = await this.userService.findOrCreate(email);
            const token = this.authService.generateToken({ id: user.id, email: user.email });
            console.log('Generated token:', token);
            return res.redirect(`/admin?token=${token}`);
        }
        catch (error) {
            console.error('OAuth Callback Error:', error.response?.data || error.message);
            return res.redirect('/error');
        }
    }
};
exports.GoogleAuthController = GoogleAuthController;
__decorate([
    (0, common_1.Get)('/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GoogleAuthController.prototype, "googleAuthCallback", null);
exports.GoogleAuthController = GoogleAuthController = __decorate([
    (0, common_1.Controller)('/auth/google'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], GoogleAuthController);
//# sourceMappingURL=google-auth.controller.js.map