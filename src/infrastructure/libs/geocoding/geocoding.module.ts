import { Module } from '@nestjs/common';
import { ApiConfig } from 'src/config/api.config';
import { CacheCityService } from 'src/infrastructure/cache/cache-city.service';

import { HttpClientService } from 'src/infrastructure/libs/http/http-client.service';
import { GeocodingCacheProxyService } from 'src/infrastructure/libs/geocoding/proxy/geocoding/geocoding-proxy.service';

import { HttpClientModule } from '../http/http-client.module';
import { CacheCityModule } from '../../../application/modules/cache/cache-city.module';
import { GeocodingService } from 'src/infrastructure/libs/geocoding/geocoding.service';

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
