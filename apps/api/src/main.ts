import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from 'src/common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: false,
    whitelist: true,
    transform: true,
    // This will throw BadRequestException for validation errors
    exceptionFactory: (errors) => {
      const messages = errors.map(error =>
        Object.values(error.constraints || {}).join(', ')
      );
      return new BadRequestException(messages);
    },

  }));
  // Use the new all-exceptions filter
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.API_PORT ?? 4000);
}
bootstrap();
