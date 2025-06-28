import { Module, Global } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsService } from './metrics.service';
import { cacheMetricProviders } from './cache-metrics';

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
