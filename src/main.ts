import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
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
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const ffApiDocs = configService.get('FEATURE_API_DOCS') === 'true';

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(helmet());
  app.enableCors();

  if (ffApiDocs) {
    setupSwagger(app);
  }

  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
