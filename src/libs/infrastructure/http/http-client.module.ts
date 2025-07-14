import { Module } from '@nestjs/common';
import { LoggingConfig } from 'src/libs/config/logging.config';
import { LoggerModule } from 'src/libs/infrastructure/logger/logger.module';

import { LoggingHttpClientService } from './decorators/weather-logger.decorator';
import { HttpClientService } from './http-client.service';

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
