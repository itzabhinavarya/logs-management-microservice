import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength, IsInt } from "class-validator";

export class CreateTaskDTO {
    @ApiProperty({
        description: "User ID",
        example: 1,
    })
    @IsInt()
    @IsNotEmpty({ message: "User ID is required" })
    userId: number;

    @ApiProperty({
        description: "Project Id",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty({ message: "Project Id is required" })
    projectId: number;

    @ApiProperty({
        description: "Task name",
        example: 'User Authentication Module',
        minLength: 3,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty({ message: "Task name is required" })
    @MinLength(3, { message: 'Task name must be at least 3 characters long' })
    @MaxLength(100, { message: 'Task name cannot exceed 100 characters' })
    name: string;

    @ApiProperty({
        description: 'Task description',
        example: 'Implement user authentication with JWT tokens',
        minLength: 10,
        maxLength: 500,
    })
    @IsString()
    @IsOptional()
    @MinLength(10, { message: 'Description must be at least 10 characters long' })
    @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
    description: string;
}