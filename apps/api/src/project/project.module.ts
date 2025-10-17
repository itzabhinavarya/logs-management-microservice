import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { LoggerModule } from 'src/infrastructure/logger.module';

@Module({
  imports: [LoggerModule],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule { }
