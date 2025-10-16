import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ProjectService } from 'src/project/project.service';
import { CreateProjectDto, QueryProjectDto, UpdateProjectDto } from './dto'

@Controller('project')
export class ProjectController {

    constructor(private readonly projectService: ProjectService) { }

    @Get('')
    allProject(@Query() query?: QueryProjectDto) {
        return this.projectService.getAll();
    }

    @Get(':id')
    getProject(@Param('id', ParseIntPipe) id: number) {
        return this.projectService.get(id)
    }

    @Post('')
    createProject(@Body() data: CreateProjectDto) {
        return this.projectService.create(data)
    }

    @Put(':id')
    updateProject(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateProjectDto) {
        return this.projectService.update(id, data)
    }

    @Patch(':id')
    deleteProject(@Param('id', ParseIntPipe) id: number) {
        return this.projectService.delete(id)
    }

}
