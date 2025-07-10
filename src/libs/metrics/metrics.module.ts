import { Global, Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { cacheMetricProviders } from './cache-metrics';
import { MetricsService } from './metrics.service';

@Global()
@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true },
      defaultLabels: { app: 'weather-api' },
    }),
  ],
  providers: [MetricsService, ...cacheMetricProviders],
  exports: [MetricsService],
})
export class MetricsModule {}
