import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SentryInterceptor } from './sentry.interceptor';
import { ApplicationContext } from './app.context';
import compression from 'fastify-compress';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await ApplicationContext();

  app.register(compression, { encodings: ['gzip', 'deflate'] });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new SentryInterceptor());

  const config = new DocumentBuilder()
    .setTitle('user-service')
    .setDescription('REST API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
    });
  }

  await app.listen(3000, '0.0.0.0');
  Logger.log('Running on port 3000');
}

bootstrap();
