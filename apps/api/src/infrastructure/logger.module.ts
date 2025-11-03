import { Module } from '@nestjs/common';
import { LoggerClient } from './logger.client';
import { JwtService } from './jwt.service';
import { AuthGuard } from './auth.guard';

@Module({
    providers: [LoggerClient, JwtService, AuthGuard],
    exports: [LoggerClient, JwtService, AuthGuard], // Export so other modules can use them
})
export class LoggerModule { }

