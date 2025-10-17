import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO, UpdateTaskDTO, QueryTaskDto, TaskResponseDto } from './dto/index'
import { ApiResponse, response, responseInstance } from 'src/utils/response';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Get('')
  async allTasks(@Query() query?: QueryTaskDto): Promise<ApiResponse<TaskResponseDto[]>> {
    const result = await this.taskService.getAll()
    const data = responseInstance(TaskResponseDto, result) as TaskResponseDto[]
    return response<TaskResponseDto[]>({
      status: true,
      statusCode: 200,
      message: 'All Task fetched successfully',
      data: data,
    })
  }

  @Get(':id')
  async singleTask(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<TaskResponseDto>> {
    const result = await this.taskService.get(id);
    const data = responseInstance(TaskResponseDto, result) as TaskResponseDto;
    return response<TaskResponseDto>({
      status: true,
      statusCode: 200,
      message: 'Task fetched successfully',
      data: data,
    })
  }

  @Post()
  async createTask(@Body() data: CreateTaskDTO): Promise<ApiResponse<TaskResponseDto>> {
    const result = await this.taskService.create(data)
    const res = responseInstance(TaskResponseDto, result) as TaskResponseDto;
    return response<TaskResponseDto>({
      status: true,
      statusCode: 200,
      message: 'Task created successfully',
      data: res,
    })
  }

  @Put(':id')
  async updateTask(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateTaskDTO): Promise<ApiResponse<TaskResponseDto>> {
    const result = await this.taskService.update(id, data);
    const res = responseInstance<TaskResponseDto>(TaskResponseDto, result) as TaskResponseDto;
    return response<TaskResponseDto>({
      status: true,
      statusCode: 200,
      message: 'Task updated successfully',
      data: res,
    })
  }

  @Patch(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<TaskResponseDto>> {
    const result = await this.taskService.delete(id)
    const data = responseInstance(TaskResponseDto, result) as TaskResponseDto;
    return response<TaskResponseDto>({
      status: true,
      statusCode: 200,
      message: 'Task deleted successfully',
      data: data,
    })
  }
}
