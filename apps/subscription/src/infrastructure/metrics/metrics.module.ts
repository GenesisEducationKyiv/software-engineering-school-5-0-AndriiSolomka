import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { subscriptionMetricProviders } from './subscription-metric.provider';
import { SubscriptionMetrics } from './subscription-metrics';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true },
      defaultLabels: { app: 'subscription-api' },
    }),
  ],
  providers: [SubscriptionMetrics, ...subscriptionMetricProviders],
  exports: [SubscriptionMetrics],
})
export class MetricsModule {}
