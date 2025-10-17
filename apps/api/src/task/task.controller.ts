import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO, UpdateTaskDTO, QueryTaskDto, TaskResponseDto } from './dto/index'
import { ApiResponse, response, responseInstance } from 'src/utils/response';
import { LoggerClient } from 'src/infrastructure/logger.client';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly loggerClient: LoggerClient // Inject LoggerClient
  ) { }

  @Get('')
  async allTasks(@Query() query?: QueryTaskDto): Promise<ApiResponse<TaskResponseDto[]>> {
    this.loggerClient.log('Fetching all tasks', 'info');
    const result = await this.taskService.getAll(query);
    this.loggerClient.log(`Successfully fetched ${result.length} tasks`, 'info');
    const data = responseInstance(TaskResponseDto, result) as TaskResponseDto[];
    return response<TaskResponseDto[]>({
      status: true,
      statusCode: 200,
      message: 'All Task fetched successfully',
      data: data,
    });
  }

  @Get(':id')
  async singleTask(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<TaskResponseDto>> {
    this.loggerClient.log(`Fetching task with id: ${id}`, 'info');
    const result = await this.taskService.get(id);
    this.loggerClient.log(`Successfully fetched task with id: ${id}`, 'info');
    const data = responseInstance(TaskResponseDto, result) as TaskResponseDto;
    return response<TaskResponseDto>({
      status: true,
      statusCode: 200,
      message: 'Task fetched successfully',
      data: data,
    });
  }

  @Post()
  async createTask(@Body() data: CreateTaskDTO): Promise<ApiResponse<TaskResponseDto>> {
    this.loggerClient.log('Creating a new task', 'info');
    const result = await this.taskService.create(data);
    this.loggerClient.log(`Task created with id: ${result.id}`, 'info');
    const res = responseInstance(TaskResponseDto, result) as TaskResponseDto;
    return response<TaskResponseDto>({
      status: true,
      statusCode: 200,
      message: 'Task created successfully',
      data: res,
    });
  }

  @Put(':id')
  async updateTask(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateTaskDTO): Promise<ApiResponse<TaskResponseDto>> {
    this.loggerClient.log(`Updating task with id: ${id}`, 'info');
    const result = await this.taskService.update(id, data);
    this.loggerClient.log(`Successfully updated task with id: ${id}`, 'info');
    const res = responseInstance(TaskResponseDto, result) as TaskResponseDto;
    return response<TaskResponseDto>({
      status: true,
      statusCode: 200,
      message: 'Task updated successfully',
      data: res,
    });
  }

  @Patch(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<TaskResponseDto>> {
    this.loggerClient.log(`Deleting task with id: ${id}`, 'info');
    const result = await this.taskService.delete(id);
    this.loggerClient.log(`Successfully deleted task with id: ${id}`, 'info');
    const data = responseInstance(TaskResponseDto, result) as TaskResponseDto;
    return response<TaskResponseDto>({
      status: true,
      statusCode: 200,
      message: 'Task deleted successfully',
      data: data,
    });
  }
}
