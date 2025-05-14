import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { FetchModule } from './fetch/fetch.module';

@Module({
  imports: [LoggerModule, FetchModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
