import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { corsConfig } from '@config/configuration';
import * as session from 'express-session';
import * as passport from 'passport';
import { jwtConstants } from './constants';
import * as cookieParser from 'cookie-parser';
// TODO: add passport https://docs.nestjs.com/security/authentication#passport
// https://github.com/jaredhanson/passport
// TODO: add helmet https://docs.nestjs.com/security/helmet
// TODO: add CSRF protection https://docs.nestjs.com/security/csrf
// TODO: add cookie-parser https://docs.nestjs.com/techniques/cookies
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.use(session({
    secret: jwtConstants.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
  }));
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api/v1');
  app.enableCors(corsConfig);

  await app.listen(3000);
}
bootstrap();
