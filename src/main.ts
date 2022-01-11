import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApplicationContext } from './app.context';
import compression from 'fastify-compress';

async function bootstrap() {
  const app = await ApplicationContext();

  app.register(compression, { encodings: ['gzip', 'deflate'] });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Example API')
    .setDescription('NestJS-Fastify-Mongoose-Swagger')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000, '0.0.0.0');
  Logger.log('Running on port 3000');
}

bootstrap();
