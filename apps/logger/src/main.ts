import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getLogs } from 'src/utils/readLogs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.LOGGER_PORT ?? 4001);
}
bootstrap();
