import { Module } from '@nestjs/common';
import { InternalWeatherModule } from 'apps/weather_api/src/infrastructure/weather/weather.module';
import { WeatherHandlersController } from 'apps/weather_api/src/interface/controllers/weather.controller';

@Module({
  imports: [InternalWeatherModule],
  controllers: [WeatherHandlersController],
})
export class WeatherControllersModule {}
