import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, QueryUserDto, UserResponseDto, LoginDto, VerifyOtpDto, ResendOtpDto, ResetPasswordDto } from './dto';
import { ApiResponse, response, responseInstance } from 'src/utils/response';
import { LoggerClient } from '../infrastructure/logger.client';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly loggerClient: LoggerClient
    ) { }

    // Authentication Endpoints
    @Post('signup')
    async signup(@Body() data: CreateUserDto): Promise<ApiResponse<UserResponseDto>> {
        this.loggerClient.log('User signup request', 'info', { email: data.email });
        const user = await this.userService.signup(data);
        this.loggerClient.log(`User signed up successfully with id: ${user.id}`, 'info', { userId: user.id });
        const result = responseInstance(UserResponseDto, user) as UserResponseDto;
        return response<UserResponseDto>({
            status: true,
            statusCode: 201,
            message: 'User registered successfully. Please verify your email with OTP',
            data: result,
        });
    }

    @Post('login')
    async login(@Body() data: LoginDto): Promise<ApiResponse<UserResponseDto>> {
        this.loggerClient.log('User login attempt', 'info', { email: data.email });
        const user = await this.userService.login(data.email, data.password);
        this.loggerClient.log(`User logged in successfully with id: ${user.id}`, 'info', { userId: user.id });
        const result = responseInstance(UserResponseDto, user) as UserResponseDto;
        return response<UserResponseDto>({
            status: true,
            statusCode: 200,
            message: 'Login successful',
            data: result,
        });
    }

    @Post('verify-otp')
    async verifyOtp(@Body() data: VerifyOtpDto): Promise<ApiResponse<UserResponseDto>> {
        this.loggerClient.log('OTP verification request', 'info', { email: data.email });
        const user = await this.userService.verifyOtp(data.email, data.otp);
        this.loggerClient.log(`User verified successfully with id: ${user.id}`, 'info', { userId: user.id });
        const result = responseInstance(UserResponseDto, user) as UserResponseDto;
        return response<UserResponseDto>({
            status: true,
            statusCode: 200,
            message: 'Account verified successfully',
            data: result,
        });
    }

    @Post('resend-otp')
    async resendOtp(@Body() data: ResendOtpDto): Promise<ApiResponse<null>> {
        this.loggerClient.log('Resend OTP request', 'info', { email: data.email });
        await this.userService.resendOtp(data.email);
        this.loggerClient.log(`OTP resent successfully to ${data.email}`, 'info');
        return response<null>({
            status: true,
            statusCode: 200,
            message: 'OTP resent successfully',
        });
    }

    @Post('request-password-reset')
    async requestPasswordReset(@Body() data: ResendOtpDto): Promise<ApiResponse<null>> {
        this.loggerClient.log('Password reset request', 'info', { email: data.email });
        await this.userService.requestPasswordReset(data.email);
        this.loggerClient.log(`Password reset OTP sent to ${data.email}`, 'info');
        return response<null>({
            status: true,
            statusCode: 200,
            message: 'Password reset OTP sent successfully',
        });
    }

    @Post('reset-password')
    async resetPassword(@Body() data: ResetPasswordDto): Promise<ApiResponse<UserResponseDto>> {
        this.loggerClient.log('Password reset attempt', 'info', { email: data.email });
        const user = await this.userService.resetPassword(data.email, data.otp, data.newPassword);
        this.loggerClient.log(`Password reset successfully for user id: ${user.id}`, 'info', { userId: user.id });
        const result = responseInstance(UserResponseDto, user) as UserResponseDto;
        return response<UserResponseDto>({
            status: true,
            statusCode: 200,
            message: 'Password reset successfully',
            data: result,
        });
    }

    // CRUD Endpoints
    @Get()
    async getAllUsers(@Query() query?: QueryUserDto): Promise<ApiResponse<UserResponseDto[]>> {
        this.loggerClient.log('Fetching all users', 'info');
        const { data, meta } = await this.userService.getAll(query);
        this.loggerClient.log(`Successfully fetched ${data.length} users`, 'info');
        const result = responseInstance(UserResponseDto, data) as UserResponseDto[];
        return response<UserResponseDto[]>({
            status: true,
            statusCode: 200,
            message: 'All users fetched successfully',
            data: result,
            meta: meta
        });
    }

    @Get(':id')
    async getUser(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<UserResponseDto>> {
        this.loggerClient.log(`Fetching user with id: ${id}`, 'info');
        const data = await this.userService.get(id);
        this.loggerClient.log(`Successfully fetched user with id: ${id}`, 'info');
        const result = responseInstance(UserResponseDto, data) as UserResponseDto;
        return response<UserResponseDto>({
            status: true,
            statusCode: 200,
            message: 'User fetched successfully',
            data: result,
        });
    }

    @Put(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto): Promise<ApiResponse<UserResponseDto>> {
        this.loggerClient.log(`Updating user with id: ${id}`, 'info');
        const res = await this.userService.update(id, data);
        this.loggerClient.log(`Successfully updated user with id: ${id}`, 'info');
        const result = responseInstance(UserResponseDto, res) as UserResponseDto;
        return response<UserResponseDto>({
            status: true,
            statusCode: 200,
            data: result,
            message: 'User updated successfully',
        });
    }

    @Patch(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<UserResponseDto>> {
        this.loggerClient.log(`Deleting user with id: ${id}`, 'info');
        const res = await this.userService.delete(id);
        this.loggerClient.log(`Successfully deleted user with id: ${id}`, 'info');
        const result = responseInstance(UserResponseDto, res) as UserResponseDto;
        return response<UserResponseDto>({
            status: true,
            statusCode: 200,
            data: result,
            message: 'User deleted successfully',
        });
    }
}
