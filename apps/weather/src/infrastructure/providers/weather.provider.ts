import { status } from '@grpc/grpc-js';
import { Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  LoggerInterface,
  LoggerToken,
} from 'libs/core/logger/logger.interface';

import { WeatherProviderInterface } from '../../core/weather-provider.interface';
import { WeatherData } from '../../core/weather.interface';

export class WeatherProviderChain implements WeatherProviderInterface {
  constructor(
    @Inject(LoggerToken)
    private readonly logger: LoggerInterface,
    private readonly providers: WeatherProviderInterface[],
  ) {}

  async getWeather(city: string): Promise<WeatherData> {
    for (const provider of this.providers) {
      try {
        const weather = await provider.getWeather(city);

        this.logger.info({
          context: WeatherProviderChain.name,
          status: 'success',
          provider: provider.constructor.name,
          method: 'getWeather',
          params: { city },
        });

        return weather;
      } catch (error) {
        this.logger.warn({
          context: WeatherProviderChain.name,
          status: 'failed',
          provider: provider.constructor.name,
          method: 'getWeather',
          params: { city },
          error,
        });
        continue;
      }
    }

    const errorMsg = 'No weather provider could handle the request';
    this.logger.error({ msg: errorMsg, city });

    throw new RpcException({
      code: status.INTERNAL,
      message: errorMsg,
    });
  }
}
