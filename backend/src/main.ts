import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { corsConfig } from '@config/configuration';
import { HoxPoxAdapter } from './events/ws-adapter';
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
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useWebSocketAdapter(new HoxPoxAdapter(app));
  app.setGlobalPrefix('api/v1');
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
