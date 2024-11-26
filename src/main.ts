import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// dotenv를 가장 먼저 호출하여 환경 변수 로드
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://port-0-webkiosk-lyuxr1k8e08e4fd2.sel4.cloudtype.app/', // 클라이언트 도메인
    credentials: true, // 쿠키 포함 허용
  });
  

  await app.listen(process.env.WEB_PORT);
}
bootstrap();
