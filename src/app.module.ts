import { Module} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoModule } from './photo/photo.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CloudinaryProvider } from './photo/cloudinary.provider';

@Module({
  imports: [
    // 정적 파일 서빙 설정
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    // ConfigModule 설정
    ConfigModule.forRoot({
      isGlobal: true, // ConfigService를 전역에서 사용 가능
      envFilePath: ['.env.local', '.env'], // 여러 환경 파일 지원
    }),
    // TypeORM 설정
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // ConfigService를 사용하기 위해 ConfigModule 추가
      useFactory: (configService: ConfigService) => {

        return {
          type: 'mariadb',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'], // 엔티티 경로
          synchronize: configService.get<string>('HTTPS') === 'false', // HTTPS가 'false'일 경우만 true
          extra: {
            connectionLimit: 10, // 동시에 최대 10개의 연결만 사용
          },
        };
      },
      inject: [ConfigService], // ConfigService 주입
    }),
    PhotoModule,
    AuthModule,
    UserModule,
  ],
  providers: [CloudinaryProvider],
})
export class AppModule {}
