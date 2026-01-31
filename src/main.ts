import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { EnvService } from '@/src/infra/env/env.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );

  const envService = app.get(EnvService);

  await app.listen({ port: envService.get('PORT'), host: '0.0.0.0' });
}
bootstrap();
