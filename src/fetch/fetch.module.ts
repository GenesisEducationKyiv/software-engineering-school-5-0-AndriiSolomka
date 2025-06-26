import { Module } from '@nestjs/common';
import { FetchService } from './fetch.service';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigType } from '@nestjs/config';
import { LoggingFetchService } from 'src/common/decorators/weather-logger.decorator';
import loggingConfig from 'src/config/logging.config';

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: FetchService,
      useFactory: (config: ConfigType<typeof loggingConfig>) => {
        const original = new FetchService();
        return new LoggingFetchService(original, config.enableFileLogging);
      },
      inject: [loggingConfig.KEY],
    },
  ],
  exports: [FetchService],
})
export class FetchModule {}
