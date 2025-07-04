import { Module } from '@nestjs/common';
import { GeocodingModule } from 'src/application/modules/infrastructure/geocoding.module';
import { WeatherModule } from 'src/application/modules/weather/weather.module';
import { WeatherHandlersController } from 'src/interface/controllers/weather.controller';

@Module({
  imports: [WeatherModule, GeocodingModule],
  controllers: [WeatherHandlersController],
})
export class WeatherControllersModule {}
