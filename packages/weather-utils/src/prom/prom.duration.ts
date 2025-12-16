import { Histogram } from 'prom-client';

import { createHistogramTimer } from './prom.histogram.timer';

/**
 * Measures the duration of an async operation and records it to a Prometheus histogram
 * @param histogram - Prometheus histogram instance
 * @param staticLabels - Static labels to apply to all measurements
 * @param fn - Async or sync function to measure
 * @returns Result of the function execution
 * @throws Re-throws any error from the function after recording it
 */
export async function measureDuration<T, TLabels extends string>(
  histogram: Histogram<TLabels>,
  staticLabels: Partial<Record<TLabels, string>>,
  fn: () => Promise<T> | T,
): Promise<T> {
  const timer = createHistogramTimer(histogram, staticLabels);

  try {
    const result = await fn();
    timer.stop({ status: 'success' } as Partial<Record<TLabels, string>>);
    return result;
  } catch (err) {
    timer.stop({ status: 'error' } as Partial<Record<TLabels, string>>);
    throw err;
  }
}
