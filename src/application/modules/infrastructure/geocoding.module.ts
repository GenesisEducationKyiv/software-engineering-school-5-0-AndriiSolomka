import { Module } from '@nestjs/common';
import { ApiConfig } from 'src/config/api.config';
import { CacheCityService } from 'src/infrastructure/cache/cache-city.service';
import { GeocodingService } from 'src/infrastructure/geocoding/geocoding.service';
import { HttpClientService } from 'src/infrastructure/http/http-client.service';
import { GeocodingCacheProxyService } from 'src/infrastructure/proxy/geocoding/geocoding-proxy.service';

import { HttpClientModule } from './http-client.module';
import { CacheCityModule } from '../cache/cache-city.module';

@Module({
  imports: [HttpClientModule, CacheCityModule],
  providers: [
    {
      provide: GeocodingService,
      useFactory: (
        httpClientService: HttpClientService,
        config: ApiConfig,
        cacheCityService: CacheCityService,
      ) => {
        const geocoding = new GeocodingService(
          httpClientService,
          config.geocodingApiUrl,
        );
        return new GeocodingCacheProxyService(geocoding, cacheCityService);
      },
      inject: [HttpClientService, ApiConfig, CacheCityService],
    },
  ],
  exports: [GeocodingService],
})
export class GeocodingModule {}
