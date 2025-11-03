import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
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
    })
    @IsString()
    @IsNotEmpty({ message: "Password is required" })
    password: string;
}

