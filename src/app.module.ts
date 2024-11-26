// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoModule } from './photo/photo.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CloudinaryProvider } from './photo/cloudinary.provider';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // 정적 파일의 루트 디렉터리
    }),
    ConfigModule.forRoot({
      isGlobal: true, // 환경 변수 모듈을 전역으로 설정
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 엔티티 경로 설정
      synchronize: process.env.HTTPS === 'false', // 개발 환경에서만 true
    }),
    PhotoModule,
    AuthModule,
    UserModule,
  
  ],
  providers: [CloudinaryProvider],
})
export class AppModule {}

