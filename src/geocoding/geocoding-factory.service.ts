import { Injectable } from '@nestjs/common';
import { FetchService } from 'src/fetch/fetch.service';
import { ConfigService } from '@nestjs/config';
import { CacheCityService } from 'src/cache-city/cache-city.service';
import { GeocodingService } from './geocoding.service';
import { GeocodingProxyService } from 'src/proxy/geocoding/geocoding-proxy.service';

@Injectable()
export class GeocodingServiceFactory {
  constructor(
    private readonly fetchService: FetchService,
    private readonly configService: ConfigService,
    private readonly cacheCityService: CacheCityService,
  ) {}

  create(): GeocodingProxyService {
    const geocoding = new GeocodingService(
      this.fetchService,
      this.configService,
    );
    return new GeocodingProxyService(geocoding, this.cacheCityService);
  }
}
