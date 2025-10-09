import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LoggerClient {
    private baseUrl = process.env.LOGGER_URL;

    async log(message: string, level: string = 'info', meta?: any) {
        try {
            await axios.post(`${this.baseUrl}/logs`, { message, level, meta });
        } catch (error) {
            console.error('Failed to send log:', error.message);
        }
    }
}
