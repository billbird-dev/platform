import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import fastifyCookie from 'fastify-cookie';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);

  app.register(fastifyCookie, {
    secret: configService.get('COOKIE_SECRET'),
  });

  await app.listen(3000);

  console.log(`on ${app.getUrl()}`);
}

bootstrap();
