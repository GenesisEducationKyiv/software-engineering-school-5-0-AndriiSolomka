import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WeatherConfig } from 'apps/notification/config/weather.config';

import { WEATHER_PACKAGE } from './core/weather.interface';
import { WeatherClientService } from './infrastructure/weather.grpc.client';

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
  exports: [WeatherClientService],
})
export class WeatherModule {}
