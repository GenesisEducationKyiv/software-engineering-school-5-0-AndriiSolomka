import { Module } from '@nestjs/common';
import { AppLoggerService } from './app-logger.service';
import { HttpLoggerService } from './http-logger.service';

@Module({
  providers: [AppLoggerService, HttpLoggerService],
  exports: [AppLoggerService, HttpLoggerService],
})
export class LoggerModule {}
