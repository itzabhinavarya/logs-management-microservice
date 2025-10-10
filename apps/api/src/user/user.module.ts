import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LoggerModule } from '../infrastructure/logger.module';

@Module({
  imports: [LoggerModule], // Import LoggerModule to use LoggerClient
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
