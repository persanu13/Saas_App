import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { validationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || [
      'http://localhost:3000',
      'googleusercontent.com',
    ], // Allow only this origin
    credentials: true, // Allow cookies to be sent
  });

  app.useGlobalPipes(validationPipe);

  app.use(cookieParser());

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TimeoutInterceptor(),
    new TransformInterceptor(),
  );

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
