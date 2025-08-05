import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { CacheMetrics } from './cache-metrics';
import { cacheMetricProviders } from './cache-metrics.providers';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true },
      defaultLabels: { app: 'weather-api' },
    }),
  ],
  providers: [CacheMetrics, ...cacheMetricProviders],
  exports: [CacheMetrics],
})
export class MetricsModule {}
