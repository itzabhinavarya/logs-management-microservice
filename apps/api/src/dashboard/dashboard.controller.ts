import { Controller, Get } from '@nestjs/common';
import { DashboardService } from 'src/dashboard/dashboard.service';
import { LoggerClient } from 'src/infrastructure/logger.client';

@Controller('dashboard')
export class DashboardController {
    
    constructor(
        private readonly service: DashboardService,
        private readonly loggerClient: LoggerClient
    ) { }

    @Get('/')
    getAllStats() {
        this.loggerClient.log('Fetched all stats for dashboard', 'info');
        return this.service.getStats()
    }
}
