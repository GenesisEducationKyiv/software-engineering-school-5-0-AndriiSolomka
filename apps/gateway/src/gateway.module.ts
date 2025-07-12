import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';

import { SubscriptionControllersModule } from './modules/subscription-controllers.module';
import { WeatherControllersModule } from './modules/weather-controller.module';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({}),
    SubscriptionControllersModule,
    WeatherControllersModule,
  ],
})
export class GatewayModule {}
