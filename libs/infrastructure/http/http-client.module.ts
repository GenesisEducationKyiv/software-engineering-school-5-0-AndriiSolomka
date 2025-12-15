import { Module } from '@nestjs/common';
import {
  LoggerInterface,
  LoggerToken,
} from 'libs/core/logger/logger.interface';

import { LoggingHttpClient } from './decorators/http-logger.decorator';
import { HttpClient } from './http-client.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: HttpClient,
      useFactory: (logger: LoggerInterface) => {
        const original = new HttpClient();
        return new LoggingHttpClient(original, logger);
      },
      inject: [LoggerToken],
    },
  ],
  exports: [HttpClient],
})
export class HttpClientModule {}
