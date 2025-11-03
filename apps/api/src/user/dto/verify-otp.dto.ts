import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
    @ApiProperty({
        description: 'User email',
        example: 'john@example.com',
    })
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @ApiProperty({
        description: 'OTP code',
        example: '123456',
        minLength: 6,
        maxLength: 6,
    })
    @IsString()
    @IsNotEmpty({ message: "OTP is required" })
    @Length(6, 6, { message: 'OTP must be exactly 6 characters' })
    otp: string;
}

