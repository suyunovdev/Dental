import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Global prefiks /api
  app.setGlobalPrefix('api');

  // Express orqasida real IP uchun trust proxy
  app.set('trust proxy', 1);

  // Xavfsizlik sarlavhalari
  app.use(helmet());

  // Cookie parser (refresh token uchun)
  app.use(cookieParser());

  // Validatsiya qat'iy tekshiruvi
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Jarayon to'xtaganda resurslarni to'g'ri yopish
  app.enableShutdownHooks();

  // CORS - faqat CORS_ORIGIN berilsa yoqiladi
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  if (corsOrigin) {
    app.enableCors({
      origin: corsOrigin.split(','),
      credentials: true,
    });
  }

  // Swagger hujjati - faqat production bo'lmaganda yoqiladi
  const isProd = configService.get<string>('NODE_ENV') === 'production';
  if (!isProd) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('F-2 Stomatologiya API')
      .setDescription('Stomatologiya klinikasi boshqaruv platformasi REST API hujjati')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      jsonDocumentUrl: 'api/docs-json',
    });
  }

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Backend server http://localhost:${port}/api da ishlamoqda`);
  if (!isProd) {
    console.log(`Swagger hujjati: http://localhost:${port}/api/docs`);
  }
}

void bootstrap();
