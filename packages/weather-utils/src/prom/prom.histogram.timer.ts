import { Histogram } from 'prom-client';

export interface HistogramTimer<TLabels extends string> {
  /**
   * Stops the timer and records the duration with the provided labels
   * @param dynamicLabels - Labels to merge with static labels
   */
  stop(dynamicLabels?: Partial<Record<TLabels, string>>): void;

  /**
   * Symbol.dispose implementation for automatic cleanup
   */
  [Symbol.dispose](): void;
}

/**
 * Creates a timer for Prometheus histogram metric
 * @param histogram - Prometheus histogram instance
 * @param staticLabels - Static labels to apply to all measurements
 * @returns Timer object with stop method and Symbol.dispose support
 */
export function createHistogramTimer<TLabels extends string>(
  histogram: Histogram<TLabels>,
  staticLabels: Partial<Record<TLabels, string>>,
): HistogramTimer<TLabels> {
  const start = histogram.startTimer();

  return {
    stop(dynamicLabels: Partial<Record<TLabels, string>> = {}) {
      start({ ...staticLabels, ...dynamicLabels });
    },

    [Symbol.dispose]() {
      start(staticLabels);
    },
  };
}
