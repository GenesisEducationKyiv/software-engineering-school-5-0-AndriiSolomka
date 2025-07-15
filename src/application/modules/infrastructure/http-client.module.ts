import { Module } from '@nestjs/common';
import { LoggingConfig } from 'src/config/logging.config';
import { HttpClientWithLogging } from 'src/infrastructure/decorators/weather-logger.decorator';
import { HttpClient } from 'src/infrastructure/http/http-client';

import { LoggerModule } from './logger.module';

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: HttpClient,
      useFactory: ({ enableFileLogging, logFileName }: LoggingConfig) => {
        const original = new HttpClient();
        return new HttpClientWithLogging(
          original,
          enableFileLogging,
          logFileName,
        );
      },
      inject: [LoggingConfig],
    },
  ],
  exports: [HttpClient],
})
export class HttpClientModule {}
