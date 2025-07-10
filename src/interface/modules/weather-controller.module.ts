import { Module } from '@nestjs/common';
import { GeocodingModule } from 'src/infrastructure/libs/geocoding/geocoding.module';
import { InternalWeatherModule } from 'src/infrastructure/weather/weather.module';
import { WeatherHandlersController } from 'src/interface/controllers/weather.controller';

@Module({
  imports: [InternalWeatherModule, GeocodingModule],
  controllers: [WeatherHandlersController],
})
export class WeatherControllersModule {}
