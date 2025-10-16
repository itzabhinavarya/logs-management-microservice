import { Controller, Get } from '@nestjs/common';

@Controller('project')
export class ProjectController {
    @Get('')
    allProject(): string {
        return 'all project'
    }
}
