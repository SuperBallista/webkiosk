import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleAuthController } from './google-auth/google-auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    // ConfigModule 등록
    ConfigModule,

    // JwtModule 비동기 설정
    JwtModule.registerAsync({
      imports: [ConfigModule], // ConfigService를 사용하기 위해 ConfigModule 추가
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // JWT 서명에 사용할 비밀키
        signOptions: { expiresIn: '1h' }, // 토큰 만료 시간
      }),
      inject: [ConfigService], // ConfigService 주입
    }),

    UserModule, // UserModule 등록
  ],
  controllers: [GoogleAuthController, AuthController],
  providers: [AuthService],
  exports: [AuthService], // AuthService를 다른 모듈에서 사용 가능하도록 export
})
export class AuthModule {}
