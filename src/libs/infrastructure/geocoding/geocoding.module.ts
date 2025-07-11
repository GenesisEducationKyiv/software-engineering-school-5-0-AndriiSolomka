import { Module } from '@nestjs/common';
import { GeocodingConfig } from 'src/libs/config/geocoding.config';

import { CacheCityModule } from './cache/cache-city.module';
import { CacheCityService } from './cache/cache-city.service';
import { GeocodingService } from './geocoding.service';
import { HttpClientModule } from '../http/http-client.module';
import { HttpClientService } from '../http/http-client.service';
import { GeocodingCacheProxyService } from './proxy/geocoding/geocoding-proxy.service';

@Module({
  imports: [HttpClientModule, CacheCityModule],
  providers: [
    {
      provide: GeocodingService,
      useFactory: (
        httpClientService: HttpClientService,
        config: GeocodingConfig,
        cacheCityService: CacheCityService,
      ) => {
        const geocoding = new GeocodingService(
          httpClientService,
          config.geocodingApiUrl,
        );
        return new GeocodingCacheProxyService(geocoding, cacheCityService);
      },
      inject: [HttpClientService, GeocodingConfig, CacheCityService],
    },
  ],
  exports: [GeocodingService],
})
export class GeocodingModule {}
