import { Module } from '@nestjs/common';
import { GeocodingModule } from 'src/application/modules/infrastructure/geocoding.module';
import { InternalWeatherModule } from 'src/infrastructure/weather/weather.module';
import { WeatherHandlersController } from 'src/interface/controllers/weather.controller';

@Module({
  imports: [InternalWeatherModule, GeocodingModule],
  controllers: [WeatherHandlersController],
})
export class WeatherControllersModule {}
