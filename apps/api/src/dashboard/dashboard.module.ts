import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { LoggerModule } from 'src/infrastructure/logger.module';

@Module({
  imports: [LoggerModule],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule { }
