import {
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

import { NOTIFICATION_METRIC_NAMES } from './constants/metrics.constants';

export const notificationMetricProviders = [
  makeCounterProvider({
    name: NOTIFICATION_METRIC_NAMES.EMAIL_PUBLISHED_TOTAL,
    help: 'Total number of published email notifications',
    labelNames: ['method', 'status'],
  }),

  makeHistogramProvider({
    name: NOTIFICATION_METRIC_NAMES.EMAIL_PUBLISH_DURATION,
    help: 'Duration of email publishing in seconds',
    labelNames: ['method', 'status'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  }),

  makeCounterProvider({
    name: NOTIFICATION_METRIC_NAMES.EMAIL_PUBLISH_ERRORS_TOTAL,
    help: 'Total number of email publish errors',
    labelNames: ['method', 'error_code'],
  }),
];
