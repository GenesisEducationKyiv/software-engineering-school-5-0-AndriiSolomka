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
import { LoggingCacheDecorator } from 'libs/infrastructure/cache/decorators/cache-logger.decorator';

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
    const service = new CacheWeatherService(this.cache, this.config);
    const serviceWithMetrics = new MetricsCacheDecorator(
      service,
      this.metrics,
      'weather',
    );

    return new LoggingCacheDecorator(
      serviceWithMetrics,
      this.logger,
      'CacheWeatherService',
    );
  }
}
