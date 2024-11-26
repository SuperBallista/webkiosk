import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('/auth/google')
export class GoogleAuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/callback')
  async googleAuthCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      console.error('Missing required parameter: code');
      return res.redirect('/error'); // 인증 코드가 없을 때
    }

    try {
      // Google OAuth 토큰 교환
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${this.configService.get<string>('REDIRECT_URL')}auth/google/callback`,
        grant_type: 'authorization_code',
        code,
      });

      // 사용자 정보 요청
      const userInfo = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
      });

      const { email } = userInfo.data;

      // 사용자 정보를 DB에 저장하거나 기존 사용자 조회
      const user = await this.userService.findOrCreate(email);

      // JWT 생성
      const token = this.authService.generateToken({ id: user.id, email: user.email });

      // 클라이언트로 JWT 전송
      return res.redirect(`/admin?token=${token}`);

    } catch (error) {
      console.error('OAuth Callback Error:', error.response?.data || error.message);

      // 인증 실패 시 '/error'로 리디렉션
      return res.redirect('/error');
    }
  }
}
