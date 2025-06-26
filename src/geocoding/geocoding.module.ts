import { Module } from '@nestjs/common';
import { FetchModule } from 'src/fetch/fetch.module';
import { CacheCityModule } from 'src/cache-city/cache-city.module';
import { ConfigType } from '@nestjs/config';
import { GeocodingService } from './geocoding.service';
import { GeocodingProxyService } from 'src/proxy/geocoding/geocoding-proxy.service';
import { FetchService } from 'src/fetch/fetch.service';
import { CacheCityService } from 'src/cache-city/cache-city.service';
import apiConfig from 'src/config/api.config';

@Module({
  imports: [FetchModule, CacheCityModule],
  providers: [
    {
      provide: GeocodingService,
      useFactory: (
        fetchService: FetchService,
        config: ConfigType<typeof apiConfig>,
        cacheCityService: CacheCityService,
      ) => {
        const geocoding = new GeocodingService(
          fetchService,
          config.geocodingApiUrl,
        );
        return new GeocodingProxyService(geocoding, cacheCityService);
      },
      inject: [FetchService, apiConfig.KEY, CacheCityService],
    },
  ],
  exports: [GeocodingService],
})
export class GeocodingModule {}
