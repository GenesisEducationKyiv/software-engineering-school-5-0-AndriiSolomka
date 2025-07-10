import { Module } from '@nestjs/common';
import { SubscriptionToken } from 'src/core/abstracts/subscription/subscription.interface';
import { InternalEmailModule } from 'src/infrastructure/email/email.module';
import { SubscriptionApiClient } from 'src/infrastructure/subscription-management/clients/subscription-api.client';
import { InternalSubscriptionModule } from 'src/infrastructure/subscription-management/subscription/subscription.module';
import { InternalWeatherModule } from 'src/infrastructure/weather/weather.module';
import { SendWeatherUpdatesUseCase } from 'src/use-cases/weather-updates/weather-updates.use-case';

@Module({
  imports: [
    InternalSubscriptionModule,
    InternalEmailModule,
    InternalWeatherModule,
    InternalEmailModule,
    InternalWeatherModule,
  ],
  providers: [
    SendWeatherUpdatesUseCase,
    {
      provide: SubscriptionToken,
      useExisting: SubscriptionApiClient,
    },
  ],
  exports: [SendWeatherUpdatesUseCase],
})
export class WeatherUpdatesModule {}
