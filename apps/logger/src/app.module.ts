import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LogsController } from './modules/logs/logs.controller';
import { LogsService } from './modules/logs/logs.service';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController, LogsController],
  providers: [AppService, LogsService],
})
export class AppModule { }
