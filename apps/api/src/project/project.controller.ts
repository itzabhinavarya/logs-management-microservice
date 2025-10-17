import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ProjectService } from 'src/project/project.service';
import { CreateProjectDto, ProjectResponseDto, QueryProjectDto, UpdateProjectDto } from './dto'
import { ApiResponse, response, responseInstance } from 'src/utils/response';

@Controller('project')
export class ProjectController {

    constructor(private readonly projectService: ProjectService) { }

    @Get('')
    async allProject(@Query() query?: QueryProjectDto): Promise<ApiResponse<ProjectResponseDto[]>> {
        const data = await this.projectService.getAll();
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
        const data = await this.projectService.get(id)
        const result = responseInstance(ProjectResponseDto, data) as ProjectResponseDto;
        return response<ProjectResponseDto>({
            status: true,
            statusCode: 200,
            message: 'Projects fetched successfully',
            data: result,
        });

    }

    @Post('')
    async createProject(@Body() data: CreateProjectDto): Promise<ApiResponse<ProjectResponseDto>> {
        const res = await this.projectService.create(data)
        const result = responseInstance(ProjectResponseDto, res) as ProjectResponseDto;
        return response<ProjectResponseDto>({
            status: true,
            statusCode: 200,
            data: result,
            message: 'Projects created successfully',
        });
    }

    @Put(':id')
    async updateProject(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateProjectDto): Promise<ApiResponse<ProjectResponseDto>> {
        const res = await this.projectService.update(id, data)
        const result = responseInstance(ProjectResponseDto, res) as ProjectResponseDto;
        return response<ProjectResponseDto>({
            status: true,
            statusCode: 200,
            data: result,
            message: 'Projects updated successfully',
        });
    }

    @Patch(':id')
    async deleteProject(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<ProjectResponseDto>> {
        const res = await this.projectService.delete(id)
        const result = responseInstance(ProjectResponseDto, res) as ProjectResponseDto;
        return response<ProjectResponseDto>({
            status: true,
            statusCode: 200,
            data: result,
            message: 'Projects updated successfully',
        });
    }

}
