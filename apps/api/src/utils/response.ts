// src/utils/response.ts
import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

export class ApiResponse<T = any> {
    @ApiProperty({ example: true })
    status: boolean;

    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({
        example: 'Request successful',
        oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } }
        ]
    })
    message: string | string[];

    @ApiProperty({ example: '2025-10-17T10:30:00.000Z' })
    timestamp: string;

    @ApiProperty({ example: 'Bad Request', required: false })
    error?: string;

    @ApiProperty({ example: {}, required: false })
    data?: T | T[];

    @ApiProperty({
        description: 'Pagination or metadata information',
        example: {
            total: 50,
            page: 2,
            limit: 10,
            totalPages: 5,
        },
        required: false,
    })
    meta?: Record<string, any>;

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
    meta?: Record<string, any>;
}

export function response<T = any>({
    status,
    statusCode,
    message,
    data,
    meta,
}: ResponseParams<T>): ApiResponse<T> {
    return new ApiResponse<T>({
        status,
        statusCode,
        message,
        timestamp: new Date().toISOString(),
        data,
        meta
    });
}

// Optional: Helper function for error responses
export function errorResponse(
    statusCode: number,
    message: string | string[],
    error?: string,
): ApiResponse<null> {
    return new ApiResponse<null>({
        status: false,
        statusCode,
        message,
        error,
        timestamp: new Date().toISOString(),
    });
}