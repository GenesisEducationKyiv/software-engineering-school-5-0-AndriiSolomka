import { Module } from '@nestjs/common';
import { LoggingConfig } from 'src/libs/config/logging.config';
import { LoggerModule } from 'src/libs/infrastructure/logger/logger.module';

import { LoggingHttpClient } from './decorators/weather-logger.decorator';
import { HttpClient } from './http-client.service';

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: HttpClient,
      useFactory: ({ enableFileLogging, logFileName }: LoggingConfig) => {
        const original = new HttpClient();
        return new LoggingHttpClient(original, enableFileLogging, logFileName);
      },
      inject: [LoggingConfig],
    },
  ],
  exports: [HttpClient],
})
export class HttpClientModule {}
