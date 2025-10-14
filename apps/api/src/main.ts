import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("process.env.PORTs", process.env.API_PORT)
  await app.listen(process.env.API_PORT ?? 4000);
}
bootstrap();
