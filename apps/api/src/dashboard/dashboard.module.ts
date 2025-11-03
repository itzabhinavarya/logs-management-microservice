import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { LoggerClient } from 'src/infrastructure/logger.client';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, LoggerClient]
})
export class DashboardModule { }
