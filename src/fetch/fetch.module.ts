import { Module } from '@nestjs/common';
import { FetchService } from './fetch.service';
import { LoggerModule } from 'src/logger/logger.module';
import { LoggingFetchService } from 'src/common/decorators/weather-logger.decorator';
import { LoggingConfig } from 'src/config/logging.config';

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: FetchService,
      useFactory: (config: LoggingConfig) => {
        const original = new FetchService();
        return new LoggingFetchService(original, config.enableFileLogging);
      },
      inject: [LoggingConfig],
    },
  ],
  exports: [FetchService],
})
export class FetchModule {}
