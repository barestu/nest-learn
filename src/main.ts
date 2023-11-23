import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as path from 'path';
import { AppModule } from './app.module';

function setupSwagger(app: INestApplication) {
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle(configService.get('APP_TITLE'))
    .setDescription(configService.get('APP_DESCRIPTION'))
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const enableApiDocs = configService.get('FEATURE_API_DOCS') === 'true';

  app.use(helmet());
  app.useStaticAssets(path.resolve(__dirname, '../../public'));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  app.enableCors();

  if (enableApiDocs) {
    setupSwagger(app);
  }

  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
