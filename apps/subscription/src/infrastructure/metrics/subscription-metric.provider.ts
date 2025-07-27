import {
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

import { SUBSCRIPTION_METRIC_NAMES } from './constants/metrics.constants';

export const subscriptionMetricProviders = [
  makeCounterProvider({
    name: SUBSCRIPTION_METRIC_NAMES.OPERATION_TOTAL,
    help: 'Total number of subscription operations',
    labelNames: ['method', 'status'],
  }),

  makeHistogramProvider({
    name: SUBSCRIPTION_METRIC_NAMES.OPERATION_DURATION,
    help: 'Duration of subscription operations',
    labelNames: ['method', 'status'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5],
  }),
];
