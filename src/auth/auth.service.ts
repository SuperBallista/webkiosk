import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: { id: string; email: string }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET, // 비밀키 명시
    });
  }

  validateToken(token: string): boolean {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // 토큰 검증
      return !!decoded; // 유효하면 true 반환
    } catch (error) {
      return false; // 유효하지 않으면 false 반환
    }
  }
}
