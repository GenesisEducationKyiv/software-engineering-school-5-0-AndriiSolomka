import { Module } from '@nestjs/common';
import { LoggingConfig } from 'src/config/logging.config';

import { LoggingHttpClientService } from './decorators/weather-logger.decorator';
import { HttpClientService } from './http-client.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: HttpClientService,
      useFactory: ({ enableFileLogging, logFileName }: LoggingConfig) => {
        const original = new HttpClientService();
        return new LoggingHttpClientService(
          original,
          enableFileLogging,
          logFileName,
        );
      },
      inject: [LoggingConfig],
    },
  ],
  exports: [HttpClientService],
})
export class HttpClientModule {}
