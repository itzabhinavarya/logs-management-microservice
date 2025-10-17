import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { LoggerModule } from 'src/infrastructure/logger.module';

@Module({
  imports: [LoggerModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule { }
