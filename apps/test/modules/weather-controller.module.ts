import { Module } from '@nestjs/common';
import { AppModule } from 'apps/weather/src/app.module';

import { WeatherHandlersController } from '../../gateway/src/weather/interface/weather.controller';

@Module({
  imports: [AppModule],
  controllers: [WeatherHandlersController],
})
export class WeatherControllersModule {}
