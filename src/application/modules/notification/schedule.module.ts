import { Module } from '@nestjs/common';
import { ScheduleUseCase } from 'src/use-cases/schedule/schedule.use-case';

import { WeatherUpdatesModule } from './weather-updates.module';
import { SubscriptionDomainModule } from '../subscription/subscription-domain.module';

@Module({
  imports: [SubscriptionDomainModule, WeatherUpdatesModule],
  providers: [ScheduleUseCase],
})
export class ScheduleModule {}
