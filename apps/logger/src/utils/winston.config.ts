import { createLogger, format, transports } from 'winston';
import * as path from 'path';

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
        // new transports.Console(),
    ],
});
