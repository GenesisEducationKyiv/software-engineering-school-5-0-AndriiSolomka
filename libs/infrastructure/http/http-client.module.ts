import { Module } from '@nestjs/common';

import { LoggingHttpClient } from './decorators/http-logger.decorator';
import { HttpClient } from './http-client.service';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: HttpClient,
      useFactory: (logger: LoggerService) => {
        const original = new HttpClient();
        return new LoggingHttpClient(original, logger);
      },
      inject: [LoggerService],
    },
  ],
  exports: [HttpClient],
})
export class HttpClientModule {}
