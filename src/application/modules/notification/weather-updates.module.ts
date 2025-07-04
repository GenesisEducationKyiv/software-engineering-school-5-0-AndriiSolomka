import { Module } from '@nestjs/common';
import { EmailToken } from 'src/core/abstracts/email/email.interface';
import { SubscriptionToken } from 'src/core/abstracts/subscription/subscription.interface';
import { WeatherToken } from 'src/core/abstracts/weather/weather.interface';
import { EmailService } from 'src/infrastructure/email/email.service';
import { SubscriptionDomainUseCase } from 'src/use-cases/subscription/subscription-domain.use-case';
import { WeatherUseCase } from 'src/use-cases/weather-updates/get-weather.use-case';
import { SendWeatherUpdatesUseCase } from 'src/use-cases/weather-updates/weather-updates.use-case';

import { EmailModule } from './email.module';
import { SubscriptionDomainModule } from '../subscription/subscription-domain.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [SubscriptionDomainModule, EmailModule, WeatherModule],
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
    {
      provide: EmailToken,
      useExisting: EmailService,
    },
  ],
  exports: [SendWeatherUpdatesUseCase],
})
export class WeatherUpdatesModule {}
