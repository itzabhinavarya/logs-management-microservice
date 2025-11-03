import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'User name',
        example: 'John Doe',
        minLength: 3,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty({ message: "User name is required" })
    @MinLength(3, { message: 'User name must be at least 3 characters long' })
    @MaxLength(100, { message: 'User name cannot exceed 100 characters' })
    name: string;

    @ApiProperty({
        description: 'User email',
        example: 'john@example.com',
    })
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'Password@123',
        minLength: 8,
    })
    @IsString()
    @IsNotEmpty({ message: "Password is required" })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    })
    password: string;

    @ApiProperty({
        description: 'User city',
        example: 'New York',
        minLength: 2,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty({ message: "City is required" })
    @MinLength(2, { message: 'City must be at least 2 characters long' })
    @MaxLength(100, { message: 'City cannot exceed 100 characters' })
    city: string;

    @ApiProperty({
        description: 'User phone',
        example: '+1234567890',
        minLength: 10,
        maxLength: 15,
    })
    @IsString()
    @IsNotEmpty({ message: "Phone is required" })
    @MinLength(10, { message: 'Phone must be at least 10 characters long' })
    @MaxLength(15, { message: 'Phone cannot exceed 15 characters' })
    phone: string;
}

