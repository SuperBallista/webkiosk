import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://port-0-webkiosk-lyuxr1k8e08e4fd2.sel4.cloudtype.app/', // 클라이언트 도메인
    credentials: true, // 쿠키 포함 허용
  });
  

  await app.listen(process.env.PORT);
}
bootstrap();
