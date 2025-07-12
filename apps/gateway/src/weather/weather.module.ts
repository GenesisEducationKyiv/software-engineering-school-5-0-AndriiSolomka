import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WeatherConfig } from 'apps/gateway/config/weather.config';

import { WEATHER_PACKAGE } from './core/weather.interface';
import { WeatherClientService } from './infrastructure/weather.grpc.client';
import { WeatherHandlersController } from './interface/weather.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: WEATHER_PACKAGE,
        useFactory: (config: WeatherConfig) => ({
          transport: Transport.GRPC,
          options: {
            url: `${config.weatherHost}:${config.weatherPort}`,
            package: 'weather',
            protoPath: 'libs/proto/weather.proto',
          },
        }),
        inject: [WeatherConfig],
      },
    ]),
  ],
  providers: [WeatherClientService],
  controllers: [WeatherHandlersController],
  exports: [WeatherClientService],
})
export class WeatherClientModule {}
