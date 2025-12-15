import { Module } from '@nestjs/common';
import { LoggerToken } from 'libs/core/logger/logger.interface';

import { LoggerService } from './logger.service';

export const LOGGER_SERVICE = Symbol('LOGGER_SERVICE');

@Module({
  providers: [
    {
      provide: LoggerToken,
      useClass: LoggerService,
    },
  ],
  exports: [LoggerToken],
})
export class LoggerModule {}
