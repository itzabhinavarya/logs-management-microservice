import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ProjectService } from 'src/project/project.service';
import { CreateProjectDto, ProjectResponseDto, QueryProjectDto, UpdateProjectDto } from './dto'
import { ApiResponse, response, responseInstance } from 'src/utils/response';
import { LoggerClient } from 'src/infrastructure/logger.client';

@Controller('project')
export class ProjectController {

    constructor(
        private readonly projectService: ProjectService,
        private readonly loggerClient: LoggerClient // Inject LoggerClient
    ) { }

    @Get('')
    async allProject(@Query() query?: QueryProjectDto): Promise<ApiResponse<ProjectResponseDto[]>> {
        this.loggerClient.log('Fetching all projects', 'info');
        const data = await this.projectService.getAll();
        this.loggerClient.log(`Successfully fetched ${data.length} projects`, 'info');
        const result = responseInstance(ProjectResponseDto, data) as ProjectResponseDto[];
        return response<ProjectResponseDto[]>({
            status: true,
            statusCode: 200,
            message: 'All projects fetched successfully',
            data: result,
        });
    }

    @Get(':id')
    async getProject(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<ProjectResponseDto>> {
        this.loggerClient.log(`Fetching project with id: ${id}`, 'info');
        const data = await this.projectService.get(id);
        this.loggerClient.log(`Successfully fetched project with id: ${id}`, 'info');
        const result = responseInstance(ProjectResponseDto, data) as ProjectResponseDto;
        return response<ProjectResponseDto>({
            status: true,
            statusCode: 200,
            message: 'Project fetched successfully',
            data: result,
        });
    }

    @Post('')
    async createProject(@Body() data: CreateProjectDto): Promise<ApiResponse<ProjectResponseDto>> {
        this.loggerClient.log('Creating a new project', 'info');
        const res = await this.projectService.create(data);
        this.loggerClient.log(`Project created with id: ${res.id}`, 'info');
        const result = responseInstance(ProjectResponseDto, res) as ProjectResponseDto;
        return response<ProjectResponseDto>({
            status: true,
            statusCode: 200,
            data: result,
            message: 'Project created successfully',
        });
    }

    @Put(':id')
    async updateProject(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateProjectDto): Promise<ApiResponse<ProjectResponseDto>> {
        this.loggerClient.log(`Updating project with id: ${id}`, 'info');
        const res = await this.projectService.update(id, data);
        this.loggerClient.log(`Successfully updated project with id: ${id}`, 'info');
        const result = responseInstance(ProjectResponseDto, res) as ProjectResponseDto;
        return response<ProjectResponseDto>({
            status: true,
            statusCode: 200,
            data: result,
            message: 'Project updated successfully',
        });
    }

    @Patch(':id')
    async deleteProject(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<ProjectResponseDto>> {
        this.loggerClient.log(`Deleting project with id: ${id}`, 'info');
        const res = await this.projectService.delete(id);
        this.loggerClient.log(`Successfully deleted project with id: ${id}`, 'info');
        const result = responseInstance(ProjectResponseDto, res) as ProjectResponseDto;
        return response<ProjectResponseDto>({
            status: true,
            statusCode: 200,
            data: result,
            message: 'Project deleted successfully',
        });
    }
}
