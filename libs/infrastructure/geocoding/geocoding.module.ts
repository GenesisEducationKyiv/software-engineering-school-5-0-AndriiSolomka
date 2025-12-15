import { Module } from '@nestjs/common';
import { GeocodingConfig } from 'libs/config/geocoding.config';

import { CacheCityModule } from './cache/cache-city.module';
import { CacheCityService } from './cache/cache-city.service';
import { GeocodingService } from './geocoding.service';
import { HttpClientModule } from '../http/http-client.module';
import { HttpClient } from '../http/http-client.service';
import { GeocodingCacheProxyService } from './proxy/geocoding/geocoding-proxy.service';

@Module({
  imports: [HttpClientModule, CacheCityModule],
  providers: [
    {
      provide: GeocodingService,
      useFactory: (
        httpClientService: HttpClient,
        config: GeocodingConfig,
        cacheCityService: CacheCityService,
      ) => {
        const geocoding = new GeocodingService(
          httpClientService,
          config.geocodingApiUrl,
        );
        return new GeocodingCacheProxyService(geocoding, cacheCityService);
      },
      inject: [HttpClient, GeocodingConfig, CacheCityService],
    },
  ],
  exports: [GeocodingService],
})
export class GeocodingModule {}
