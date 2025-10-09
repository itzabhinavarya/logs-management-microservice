import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { apiProxy } from './routes/api-proxy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/api', apiProxy);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
