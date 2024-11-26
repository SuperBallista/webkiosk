import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5000', // 클라이언트 도메인
    credentials: true, // 쿠키 포함 허용
  });
  

  await app.listen(process.env.WEB_PORT);
}
bootstrap();
