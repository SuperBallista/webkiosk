import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get<string>('REDIRECT_URL'), // 클라이언트 도메인
    credentials: true, // 쿠키 포함 허용
  });

  await app.listen(process.env.WEB_PORT);
}
bootstrap();
