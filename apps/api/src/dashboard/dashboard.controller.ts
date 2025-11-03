import { Controller, Get } from '@nestjs/common';
import { DashboardService } from 'src/dashboard/dashboard.service';
import { LoggerClient } from 'src/infrastructure/logger.client';
import { response } from 'src/utils/response';

@Controller('dashboard')
export class DashboardController {

    constructor(
        private readonly service: DashboardService,
        private readonly loggerClient: LoggerClient
    ) { }

    @Get('/stats')
    async getAllStats() {
        this.loggerClient.log('Fetching all stats for dashboard', 'info');
        const data = await this.service.getStats()
        this.loggerClient.log('Fetched all stats for dashboard', 'info');
        return response({
            status: true,
            statusCode: 200,
            message: 'All stats fetched successfully',
            data
        })
    }
}
