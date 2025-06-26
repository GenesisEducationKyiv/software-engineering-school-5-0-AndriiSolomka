import { Module } from '@nestjs/common';
import { FetchModule } from 'src/fetch/fetch.module';
import { CacheCityModule } from 'src/cache-city/cache-city.module';
import { GeocodingService } from './geocoding.service';
import { GeocodingProxyService } from 'src/proxy/geocoding/geocoding-proxy.service';
import { FetchService } from 'src/fetch/fetch.service';
import { CacheCityService } from 'src/cache-city/cache-city.service';
import { ApiConfig } from 'src/config/api.config';

@Module({
  imports: [FetchModule, CacheCityModule],
  providers: [
    {
      provide: GeocodingService,
      useFactory: (
        fetchService: FetchService,
        config: ApiConfig,
        cacheCityService: CacheCityService,
      ) => {
        const geocoding = new GeocodingService(
          fetchService,
          config.geocodingApiUrl,
        );
        return new GeocodingProxyService(geocoding, cacheCityService);
      },
      inject: [FetchService, ApiConfig, CacheCityService],
    },
  ],
  exports: [GeocodingService],
})
export class GeocodingModule {}
