import { Inject, Injectable } from '@nestjs/common';
import { CacheConfig } from 'apps/weather/config/cache.config';
import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from 'libs/core/cache/cache-repository.interface';
import {
  LoggerInterface,
  LoggerToken,
} from 'libs/core/logger/logger.interface';

import { CacheWeatherService } from './cache-weather.service';
import { MetricsCacheDecorator } from '../decorators/metrics-cache.decorator';
import { CacheMetrics } from '../metrics/cache-metrics';

@Injectable()
export class CacheWeatherFactory {
  constructor(
    @Inject(CacheRepositoryToken)
    private readonly cache: CacheRepositoryInterface,
    @Inject(LoggerToken)
    private readonly logger: LoggerInterface,
    private readonly metrics: CacheMetrics,
    private readonly config: CacheConfig,
  ) {}

  create() {
    const service = new CacheWeatherService(
      this.logger,
      this.cache,
      this.config,
    );
    return new MetricsCacheDecorator(service, this.metrics, 'weather');
  }
}
