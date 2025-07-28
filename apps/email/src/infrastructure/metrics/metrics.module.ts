import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { emailMetricProviders } from './email-metric.provider';
import { EmailMetrics } from './email-metrics';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true },
      defaultLabels: { app: 'email-api' },
    }),
  ],
  providers: [EmailMetrics, ...emailMetricProviders],
  exports: [EmailMetrics],
})
export class MetricsModule {}
