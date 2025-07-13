import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { CacheCityConfig } from 'libs/config/cache.config';
import { GeocodingConfig } from 'libs/config/geocoding.config';
import { GeocodingModule } from 'libs/infrastructure/geocoding/geocoding.module';

import { EmailClientModule } from './email/email.module';
import { SubscriptionClientModule } from './subscription/subscription.module';
import { WeatherClientModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({}),
    WeatherClientModule,
    EmailClientModule,
    SubscriptionClientModule,
    GeocodingModule,
    GeocodingConfig,
    CacheCityConfig,
  ],
})
export class AppModule {}
