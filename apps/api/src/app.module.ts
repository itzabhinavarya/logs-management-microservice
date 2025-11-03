import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from 'prisma/prisma.module';
import { LoggerModule } from './infrastructure/logger.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: "../../../.env",
  }),
    PrismaModule,
    UserModule,
    LoggerModule,
    ProjectModule,
    TaskModule,
    DashboardModule
  ], // LoggerModule available globally
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
