import { Module } from '@nestjs/common';
import { WeatherAppModule } from 'apps/weather/src/weather.module';

import { WeatherHandlersController } from '../controllers/weather.controller';

@Module({
  imports: [WeatherAppModule],
  controllers: [WeatherHandlersController],
})
export class WeatherControllersModule {}
