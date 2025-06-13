import { Module } from '@nestjs/common';
import { CacheCityService } from './cache-city.service';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [CacheModule],
  providers: [CacheCityService],
  exports: [CacheCityService],
})
export class CacheCityModule {}
