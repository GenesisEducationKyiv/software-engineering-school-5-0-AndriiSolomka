import { Module } from '@nestjs/common';
import { SubscriptionToken } from 'src/core/abstracts/subscription/subscription.interface';
import { WeatherToken } from 'src/core/abstracts/weather/weather.interface';
import { InternalEmailModule } from 'src/infrastructure/email/email.module';
import { SubscriptionApiClient } from 'src/infrastructure/subscription-management/clients/subscription-api.client';
import { InternalSubscriptionModule } from 'src/infrastructure/subscription-management/subscription/subscription.module';
import { WeatherUseCase } from 'src/use-cases/weather-updates/get-weather.use-case';
import { SendWeatherUpdatesUseCase } from 'src/use-cases/weather-updates/weather-updates.use-case';

import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [
    InternalSubscriptionModule,
    InternalEmailModule,
    WeatherModule,
    InternalEmailModule,
  ],
  providers: [
    SendWeatherUpdatesUseCase,
    {
      provide: SubscriptionToken,
      useExisting: SubscriptionApiClient,
    },
    {
      provide: WeatherToken,
      useExisting: WeatherUseCase,
    },
  ],
  exports: [SendWeatherUpdatesUseCase],
})
export class WeatherUpdatesModule {}
