import { Module } from '@nestjs/common';
import { AppModule } from 'apps/weather/src/app.module';
import { WeatherHandlersController } from 'apps/weather_api/src/interface/controllers/weather.controller';

@Module({
  imports: [AppModule],
  controllers: [WeatherHandlersController],
})
export class WeatherControllersModule {}
