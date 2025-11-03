import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
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
    })
    @IsString()
    @IsNotEmpty({ message: "OTP is required" })
    otp: string;

    @ApiProperty({
        description: 'New password',
        example: 'NewPassword@123',
        minLength: 8,
    })
    @IsString()
    @IsNotEmpty({ message: "New password is required" })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    })
    newPassword: string;
}

