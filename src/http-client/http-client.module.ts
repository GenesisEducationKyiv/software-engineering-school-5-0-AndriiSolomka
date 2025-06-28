import { Module } from '@nestjs/common';
import { HttpClientService } from './http-client.service';
import { LoggerModule } from 'src/logger/logger.module';
import { LoggingFetchService } from 'src/common/decorators/weather-logger.decorator';
import { LoggingConfig } from 'src/config/logging.config';

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: HttpClientService,
      useFactory: (config: LoggingConfig) => {
        const original = new HttpClientService();
        return new LoggingFetchService(original, config.enableFileLogging);
      },
      inject: [LoggingConfig],
    },
  ],
  exports: [HttpClientService],
})
export class HttpClientModule {}
