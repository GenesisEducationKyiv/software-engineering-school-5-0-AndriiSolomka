import { Module } from '@nestjs/common';
import { SubscriptionToken } from 'src/core/abstracts/subscription/subscription.interface';
import { WeatherToken } from 'src/core/abstracts/weather/weather.interface';
import { InternalEmailModule } from 'src/infrastructure/email/email.module';
import { SubscriptionDomainUseCase } from 'src/use-cases/subscription/subscription-domain.use-case';
import { WeatherUseCase } from 'src/use-cases/weather-updates/get-weather.use-case';
import { SendWeatherUpdatesUseCase } from 'src/use-cases/weather-updates/weather-updates.use-case';

import { SubscriptionDomainModule } from '../subscription/subscription-domain.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [
    SubscriptionDomainModule,
    InternalEmailModule,
    WeatherModule,
    InternalEmailModule,
  ],
  providers: [
    SendWeatherUpdatesUseCase,
    {
      provide: SubscriptionToken,
      useExisting: SubscriptionDomainUseCase,
    },
    {
      provide: WeatherToken,
      useExisting: WeatherUseCase,
    },
  ],
  exports: [SendWeatherUpdatesUseCase],
})
export class WeatherUpdatesModule {}
