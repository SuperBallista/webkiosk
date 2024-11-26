import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/validate')
  async validateToken(@Body('token') token: string) {
    try {
      console.log('Token:', token);
      const isValid = this.authService.validateToken(token);
      return { valid: isValid }; // 유효한 경우 valid: true 반환
    } catch (error) {
      console.error('Token validation error:', error.message);
      return { valid: false }; // 유효하지 않은 경우 valid: false 반환
    }
  }
}
