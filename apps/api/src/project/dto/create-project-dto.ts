import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
    @ApiProperty({
        description: 'Project name',
        example: 'E-commerce Platform',
        minLength: 3,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty({ message: "Project name is required" })
    @MinLength(3, { message: 'Project name must be at least 3 characters long' })
    @MaxLength(100, { message: 'Project name cannot exceed 100 characters' })
    name: string;

    @ApiProperty({
        description: 'Project description',
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