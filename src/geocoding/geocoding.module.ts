import { Module } from '@nestjs/common';
import { FetchModule } from 'src/fetch/fetch.module';
import { CacheCityModule } from 'src/cache-city/cache-city.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GeocodingService } from './geocoding.service';
import { GeocodingProxyService } from 'src/proxy/geocoding/geocoding-proxy.service';
import { FetchService } from 'src/fetch/fetch.service';
import { CacheCityService } from 'src/cache-city/cache-city.service';

@Module({
  imports: [FetchModule, CacheCityModule, ConfigModule],
  providers: [
    {
      provide: GeocodingService,
      useFactory: (
        fetchService: FetchService,
        configService: ConfigService,
        cacheCityService: CacheCityService,
      ) => {
        const geocoding = new GeocodingService(fetchService, configService);
        return new GeocodingProxyService(geocoding, cacheCityService);
      },
      inject: [FetchService, ConfigService, CacheCityService],
    },
  ],
  exports: [GeocodingService],
})
export class GeocodingModule {}
