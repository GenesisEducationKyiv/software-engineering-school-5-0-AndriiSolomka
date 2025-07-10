import { Module } from '@nestjs/common';
import { InternalWeatherModule } from 'src/infrastructure/weather/weather.module';
import { WeatherHandlersController } from 'src/interface/controllers/weather.controller';

@Module({
  imports: [InternalWeatherModule],
  controllers: [WeatherHandlersController],
})
export class WeatherControllersModule {}
