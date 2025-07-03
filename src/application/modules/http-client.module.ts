import { Module } from '@nestjs/common';
import { LoggerModule } from './logger.module';
import { HttpClientService } from 'src/infrastructure/http/http-client.service';
import { LoggingConfig } from 'src/config/logging.config';
import { LoggingFetchService } from 'src/infrastructure/decorators/weather-logger.decorator';

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: HttpClientService,
      useFactory: ({ enableFileLogging, logFileName }: LoggingConfig) => {
        const original = new HttpClientService();
        return new LoggingFetchService(
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
