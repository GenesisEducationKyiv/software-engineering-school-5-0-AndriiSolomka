import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';

import { WeatherClientModule } from './weather/weather.module';

@Module({
  imports: [ConfigifyModule.forRootAsync({}), WeatherClientModule],
})
export class GatewayModule {}
