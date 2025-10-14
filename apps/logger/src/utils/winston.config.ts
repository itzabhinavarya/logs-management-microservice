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
            logStreamName: `logger-dev`,
            awsRegion: process.env.AWS_REGION || 'ap-south-1',
            jsonMessage: true,
            awsSecretKey: process.env.AWS_SECRET_KEY || '1',
            awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '1',
        }),
    ],
});
