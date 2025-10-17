import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTaskDTO {
    @ApiProperty({
        description: "Project Id",
        example: 'Project id in which the task is being created',
    })
    @IsNumber()
    @IsNotEmpty({ message: "Project Id is required" })
    projectId: number;

    @ApiProperty({
        description: "Task name",
        example: 'A full-featured e-commerce platform with payment integration',
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
        example: 'A full-featured e-commerce platform with payment integration',
        minLength: 10,
        maxLength: 500,
    })
    @IsString()
    @IsOptional()
    @MinLength(10, { message: 'Description must be at least 10 characters long' })
    @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
    description: string;
}