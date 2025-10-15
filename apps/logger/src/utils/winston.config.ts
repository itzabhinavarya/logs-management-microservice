import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import WinstonCloudWatch from 'winston-cloudwatch';

const logDir = path.join(process.cwd(), 'logs');

export const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json(),
    ),
    transports: [
        new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
        new transports.File({ filename: path.join(logDir, 'combined.log') }),
        new transports.Console(),
        new WinstonCloudWatch({
            logGroupName: '/microservices/logger',
            logStreamName: `logger-dev`, // Make it unique
            awsRegion: 'ap-south-1',
            jsonMessage: true,
            awsAccessKeyId: 'test',
            awsSecretKey: 'test',
            // Add these LocalStack-specific options:
            awsOptions: {
                endpoint: 'http://localhost:4566', // LocalStack endpoint
                credentials: {
                    accessKeyId: 'test',
                    secretAccessKey: 'test',
                }
            }
        }),
    ],
});
