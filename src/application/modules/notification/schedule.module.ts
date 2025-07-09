import { Module } from '@nestjs/common';
import { InternalSubscriptionModule } from 'src/infrastructure/subscription-management/subscription/subscription.module';
import { ScheduleUseCase } from 'src/use-cases/schedule/schedule.use-case';

import { WeatherUpdatesModule } from './weather-updates.module';

@Module({
  imports: [InternalSubscriptionModule, WeatherUpdatesModule],
  providers: [ScheduleUseCase],
})
export class ScheduleModule {}
