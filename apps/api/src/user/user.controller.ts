import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoggerClient } from '../infrastructure/logger.client';

@Controller('user')
export class UserController {
    constructor(
        private readonly userServices: UserService,
        private readonly loggerClient: LoggerClient // Inject LoggerClient
    ) { }
    @Get()
    async getAll(): Promise<any> {
        this.loggerClient.log('Fetching all users', 'info');
        const records = await this.userServices.getAllUsers()
        this.loggerClient.log(`Successfully fetched ${records.length} users`, 'info');
        return {
            status: true,
            message: "User fetched successfully",
            data: records
        }
    }

    @Get(':id')
    async get(@Param('id') id: number): Promise<any> {
        this.loggerClient.log(`Fetching user with ID: ${id}`, 'info', { userId: id });
        const resp = await this.userServices.getUser(Number(id))
        this.loggerClient.log(`Successfully fetched user with ID: ${id}`, 'info', { userId: id });
        return {
            status: true,
            message: "User fetched successfully",
            data: resp
        }
    }

    @Post('')
    create(@Body() data: any): any {
        this.loggerClient.log('Creating new user', 'info', { email: data.email });
        this.userServices.createUser(data);
        this.loggerClient.log('User created successfully', 'info', { email: data.email });
        return {
            status: true,
            message: "User created successfully",
        }
    }

    @Put(':id')
    update(@Body() data: any, @Param('id') id: number): any {
        this.loggerClient.log(`Updating user with ID: ${id}`, 'info', { userId: id });
        this.userServices.updateUser(Number(id), data)
        this.loggerClient.log(`User updated successfully with ID: ${id}`, 'info', { userId: id });
        return {
            status: true,
            message: "User updated successfully",
        }
    }

    @Patch(':id')
    softDelete(@Param('id') id: number): string {
        this.loggerClient.log(`Soft deleting user with ID: ${id}`, 'warn', { userId: id });
        this.loggerClient.log(`User soft deleted with ID: ${id}`, 'warn', { userId: id });
        return 'Soft Deleted Successfully' + id
    }

    @Delete(':id')
    hardDelete(@Param('id') id: number): any {
        this.loggerClient.log(`Hard deleting user with ID: ${id}`, 'warn', { userId: id, action: 'hard_delete' });
        this.userServices.deleteUser(Number(id))
        this.loggerClient.log(`User permanently deleted with ID: ${id}`, 'warn', { userId: id, action: 'hard_delete' });
        return {
            status: true,
            message: "User Deleted successfully",
        }
    }
}
