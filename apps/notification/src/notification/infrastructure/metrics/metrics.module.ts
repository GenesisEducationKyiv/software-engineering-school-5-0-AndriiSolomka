import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { notificationMetricProviders } from './notification-metric.provider';
import { NotificationMetrics } from './notification-metrics';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true },
      defaultLabels: { app: 'notification-api' },
    }),
  ],
  providers: [NotificationMetrics, ...notificationMetricProviders],
  exports: [NotificationMetrics],
})
export class MetricsModule {}
