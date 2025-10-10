import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
@Controller('user')
export class UserController {
    constructor(private readonly userServices: UserService) { }
    @Get()
    async getAll(): Promise<any> {
        const records = await this.userServices.getAllUsers()
        return {
            status: true,
            message: "User fetched successfully",
            data: records
        }
    }

    @Get(':id')
    async get(@Param('id') id: number): Promise<any> {
        const resp = await this.userServices.getUser(Number(id))
        return {
            status: true,
            message: "User fetched successfully",
            data: resp
        }
    }

    @Post('')
    create(@Body() data: any): any {
        this.userServices.createUser(data);
        return {
            status: true,
            message: "User created successfully",
        }
    }

    @Put(':id')
    update(@Body() data: any, @Param('id') id: number): any {
        this.userServices.updateUser(Number(id), data)
        return {
            status: true,
            message: "User updated successfully",
        }
    }

    @Patch(':id')
    softDelete(@Param('id') id: number): string {
        return 'Soft Deleted Successfully' + id
    }

    @Delete(':id')
    hardDelete(@Param('id') id: number): any {
        this.userServices.deleteUser(Number(id))
        return {
            status: true,
            message: "User Deleted successfully",
        }
    }
}
