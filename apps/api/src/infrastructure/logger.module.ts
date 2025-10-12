import { Module } from '@nestjs/common';
import { LoggerClient } from './logger.client';

@Module({
    providers: [LoggerClient],
    exports: [LoggerClient], // Export so other modules can use it
})
export class LoggerModule { }

