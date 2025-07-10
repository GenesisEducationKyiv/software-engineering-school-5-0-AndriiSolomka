import { Global, Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { cacheMetricProviders } from '../cache/metrics/cache-metrics';
import { CacheMetricsService } from '../cache/metrics/cache-metrics.service';

@Global()
@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true },
      defaultLabels: { app: 'weather-api' },
    }),
  ],
  providers: [CacheMetricsService, ...cacheMetricProviders],
  exports: [CacheMetricsService],
})
export class MetricsModule {}
