import { Module } from '@nestjs/common';
import { HttpClientModule } from 'src/http-client/http-client.module';
import { CacheCityModule } from 'src/cache-city/cache-city.module';
import { GeocodingService } from './geocoding.service';
import { GeocodingProxyService } from 'src/proxy/geocoding/geocoding-proxy.service';
import { HttpClientService } from 'src/http-client/http-client.service';
import { CacheCityService } from 'src/cache-city/cache-city.service';
import { ApiConfig } from 'src/config/api.config';

@Module({
  imports: [HttpClientModule, CacheCityModule],
  providers: [
    {
      provide: GeocodingService,
      useFactory: (
        fetchService: HttpClientService,
        config: ApiConfig,
        cacheCityService: CacheCityService,
      ) => {
        const geocoding = new GeocodingService(
          fetchService,
          config.geocodingApiUrl,
        );
        return new GeocodingProxyService(geocoding, cacheCityService);
      },
      inject: [HttpClientService, ApiConfig, CacheCityService],
    },
  ],
  exports: [GeocodingService],
})
export class GeocodingModule {}
