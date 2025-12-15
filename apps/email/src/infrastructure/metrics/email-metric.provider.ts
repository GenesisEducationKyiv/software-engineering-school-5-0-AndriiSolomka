import {
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

import { EMAIL_METRIC_NAMES } from './constants/metrics.constants';

export const emailMetricProviders = [
  makeCounterProvider({
    name: EMAIL_METRIC_NAMES.SENT_TOTAL,
    help: 'Total number of sent emails',
    labelNames: ['method', 'status'],
  }),

  makeHistogramProvider({
    name: EMAIL_METRIC_NAMES.SEND_DURATION,
    help: 'Duration of email sending in seconds',
    labelNames: ['method', 'status'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  }),

  makeCounterProvider({
    name: EMAIL_METRIC_NAMES.SEND_ERRORS_TOTAL,
    help: 'Total number of email send errors',
    labelNames: ['method', 'error_code'],
  }),
];
