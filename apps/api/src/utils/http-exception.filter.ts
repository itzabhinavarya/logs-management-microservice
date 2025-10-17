// src/common/filters/all-exception.filter.ts
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger
} from '@nestjs/common';
import { Response } from 'express';
import { errorResponse } from 'src/utils/response';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = 'Internal server error';
        let error = 'Internal Server Error';

        // Handle Prisma errors
        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            const prismaError = this.handlePrismaError(exception);
            statusCode = prismaError.statusCode;
            message = prismaError.message;
            error = prismaError.error;
        }
        // Handle Prisma validation errors
        else if (exception instanceof Prisma.PrismaClientValidationError) {
            statusCode = HttpStatus.BAD_REQUEST;
            message = 'Validation error in request data';
            error = 'Bad Request';
            this.logger.error('Prisma validation error', exception.message);
        }
        // Handle HTTP exceptions
        else if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const errorResponse = exception.getResponse();

            if (typeof errorResponse === 'object') {
                message = (errorResponse as any).message || message;
                error = (errorResponse as any).error || error;
            } else {
                message = errorResponse;
            }
        }
        // Handle regular JavaScript errors
        else if (exception instanceof Error) {
            message = exception.message;
            error = 'Error';
            this.logger.error(
                `Unhandled exception: ${exception.message}`,
                exception.stack,
            );
        }
        // Handle unknown exceptions
        else {
            this.logger.error('Unknown exception occurred', exception);
        }

        const result = errorResponse(
            statusCode,
            message,
            error,
        );

        response.status(statusCode).json(result);
    }

    private handlePrismaError(exception: Prisma.PrismaClientKnownRequestError): {
        statusCode: number;
        message: string;
        error: string;
    } {
        const modelName = (exception.meta?.modelName as string) || 'Record';
        const cause = (exception.meta?.cause as string) || 'Internal Server Error';
        console.log("cause", cause)
        switch (exception.code) {
            case 'P2000':
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'The provided value is too long for the field' + cause,
                    error: 'Bad Request',
                };
            case 'P2001':
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: `${modelName} does not exist, ${cause}`,
                    error: 'Not Found',
                };
            case 'P2002':
                const target = (exception.meta?.target as string[]) || [];
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: `${modelName} with this ${target.join(', ')} already exists, ${cause}`,
                    error: 'Conflict',
                };
            case 'P2003':
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Foreign key constraint failed' + cause,
                    error: 'Bad Request',
                };
            case 'P2025':
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    // message: `${modelName} not found`,
                    message: `${cause}`,
                    error: 'Not Found',
                };
            case 'P2016':
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Query interpretation error' + cause,
                    error: 'Bad Request',
                };
            case 'P2021':
                return {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'The table does not exist in the database' + cause,
                    error: 'Internal Server Error',
                };
            case 'P2022':
                return {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'The column does not exist in the database' + cause,
                    error: 'Internal Server Error',
                };
            default:
                this.logger.error(`Unhandled Prisma error code: ${exception.code}`, exception.message);
                return {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Database operation failed' + cause,
                    error: 'Internal Server Error',
                };
        }
    }
}