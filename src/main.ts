import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from '@/src/infra/env/env.service';
import cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envService = app.get(EnvService);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.setGlobalPrefix('api');

  app.enableCors();

  await app.listen(envService.get('PORT'), '0.0.0.0');
}
bootstrap();
