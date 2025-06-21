import { Module } from '@nestjs/common';
import { FetchModule } from 'src/fetch/fetch.module';
import { CacheCityModule } from 'src/cache-city/cache-city.module';
import { ConfigModule } from '@nestjs/config';
import { GeocodingService } from './geocoding.service';
import { GeocodingServiceFactory } from './geocoding-factory.service';

@Module({
  imports: [FetchModule, CacheCityModule, ConfigModule],
  providers: [
    GeocodingServiceFactory,
    {
      provide: GeocodingService,
      useFactory: (factory: GeocodingServiceFactory) => factory.create(),
      inject: [GeocodingServiceFactory],
    },
  ],
  exports: [GeocodingService],
})
export class GeocodingModule {}
