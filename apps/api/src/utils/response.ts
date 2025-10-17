// src/utils/response.ts
import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

export class ApiResponse<T> {
    @ApiProperty({ example: true })
    status: boolean;

    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ example: 'Request successful' })
    message: string;

    @ApiProperty({ example: '2025-10-17T10:30:00.000Z' })
    timestamp: string;

    @ApiProperty({ example: {}, required: false })
    data?: T | T[];

    constructor(partial: Partial<ApiResponse<T>>) {
        Object.assign(this, partial);
    }
}

export function responseInstance<T>(
    dto: new (...args: any[]) => T,
    data: any
): T | T[] {
    return plainToInstance(dto, data, {
        excludeExtraneousValues: true,
    }) as T | T[];
}

interface ResponseParams<T> {
    status: boolean;
    statusCode: number;
    message: string;
    data?: T;
}

export function response<T = any>({ status, statusCode, message, data }: ResponseParams<T>): ApiResponse<T> {
    return new ApiResponse<T>({
        status,
        statusCode,
        message,
        timestamp: new Date().toISOString(),
        data,
    });
}