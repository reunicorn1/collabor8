import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { corsConfig } from '@config/configuration';
import { HoxPoxAdapter } from './events/ws-adapter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
// TODO: add passport https://docs.nestjs.com/security/authentication#passport
// https://github.com/jaredhanson/passport
// TODO: add helmet https://docs.nestjs.com/security/helmet
// TODO: add CSRF protection https://docs.nestjs.com/security/csrf
// TODO: add cookie-parser https://docs.nestjs.com/techniques/cookies
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: corsConfig,
    logger: ['error', 'warn', 'log'],
  });
  const options = new DocumentBuilder()
    .setTitle('Collabor8')
    .setDescription('Your API description')
    .setVersion('1.0')
    .addServer('http://localhost:3000/api/v1', 'Local environment')
    .addServer('https://staging.yourapi.com/api/v1', 'Staging')
    .addServer('https://production.yourapi.com/api/v1', 'Production')
    .addTag('Your API Tag')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useWebSocketAdapter(new HoxPoxAdapter(app));
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
