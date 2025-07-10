import { Module } from '@nestjs/common';
import { InternalWeatherModule } from 'src/infrastructure/weather/weather.module';
import { WeatherHandlersController } from 'src/interface/controllers/weather.controller';
import { GeocodingModule } from 'src/libs/geocoding/geocoding.module';

@Module({
  imports: [InternalWeatherModule, GeocodingModule],
  controllers: [WeatherHandlersController],
})
export class WeatherControllersModule {}
