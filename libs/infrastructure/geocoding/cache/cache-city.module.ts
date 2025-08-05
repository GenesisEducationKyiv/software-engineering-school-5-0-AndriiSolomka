import { Module } from '@nestjs/common';
import { LoggerModule } from 'libs/infrastructure/logger/logger.module';

import { CacheCityService } from './cache-city.service';
import { CacheModule } from '../../cache/cache.module';

@Module({
  imports: [CacheModule, LoggerModule],
  providers: [CacheCityService],
  exports: [CacheCityService],
})
export class CacheCityModule {}
