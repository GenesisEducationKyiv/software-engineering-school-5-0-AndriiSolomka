import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';

import { EmailClientModule } from './email/email.module';
import { SubscriptionClientModule } from './subscription/subscription.module';
import { WeatherClientModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({}),
    WeatherClientModule,
    EmailClientModule,
    SubscriptionClientModule,
  ],
})
export class GatewayModule {}
