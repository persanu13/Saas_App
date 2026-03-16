import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || [
      'http://localhost:3000',
      'googleusercontent.com',
    ], // Allow only this origin
    credentials: true, // Allow cookies to be sent
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // enables class-transformer
      whitelist: true, // strips properties not in DTO
      forbidNonWhitelisted: true, // throws error on extra props
    }),
  );
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
