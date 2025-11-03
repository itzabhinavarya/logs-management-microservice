import { Controller, Get } from '@nestjs/common';
import { DashboardService } from 'src/dashboard/dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly service: DashboardService) { }

    @Get('/')
    getAllStats() {
        return this.service.getStats()
    }
}
