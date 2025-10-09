import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Get()
    getAll(): string {
        return 'this is cat'
    }

    @Get(':id')
    get(@Param('id') id: number): string {
        return 'this is user with id' + id;
    }

    @Post('')
    create(@Body() data: any): string {
        console.log(data)
        return "Creted Successfully"
    }

    @Put(':id')
    update(@Body() data: any, @Param('id') id: number): string {
        console.log('id', id)
        console.log('data', data)
        return 'Updated Successfully'
    }

    @Patch(':id')
    softDelete(@Param('id') id: number): string {
        return 'Soft Deleted Successfully' + id
    }

    @Delete(':id')
    hardDelete(@Param('id') id: number): string {
        return 'hard delete successfull' + id;
    }
}
