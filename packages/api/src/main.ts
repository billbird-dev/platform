import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import fastifyCookie from 'fastify-cookie';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
    {
      cors: {
        origin: ['http://localhost:8080', 'https://beta.billbird.in'],
        credentials: true,
        exposedHeaders: ['set-cookie'],
      },
    },
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

  const config = new DocumentBuilder()
    .addBasicAuth()
    .addCookieAuth('__bta')
    .setTitle('BillBird API')
    .setDescription('BillBird platform API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.get('PORT') || 3000);

  console.log(`on ${app.getUrl()}`);
}

bootstrap();
