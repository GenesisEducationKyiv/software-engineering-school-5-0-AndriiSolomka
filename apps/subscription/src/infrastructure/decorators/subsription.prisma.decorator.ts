import { LoggerInterface } from 'libs/core/logger/logger.interface';

import {
  Frequency,
  SubscriptionEntity,
} from '../../core/entities/subscription.entity';
import {
  SubscriptionParams,
  SubscriptionRepositoryInterface,
} from '../../core/subscription/subscription-repository.interface';

export class LoggingSubscriptionRepositoryDecorator
  implements SubscriptionRepositoryInterface
{
  constructor(
    private readonly wrapped: SubscriptionRepositoryInterface,
    private readonly logger: LoggerInterface,
    private readonly context: string = 'SubscriptionRepository',
  ) {}

  private logSuccess(
    method: string,
    durationMs: number,
    params: Record<string, unknown> = {},
  ) {
    this.logger.info({
      context: this.context,
      method,
      event: 'success',
      durationMs,
      params,
    });
  }

  private logError(
    method: string,
    durationMs: number,
    error: unknown,
    params: Record<string, unknown> = {},
  ) {
    this.logger.error({
      context: this.context,
      method,
      event: 'error',
      durationMs,
      params,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  private async logAndExecute<T>(
    methodName: string,
    params: Record<string, unknown>,
    fn: () => Promise<T>,
  ): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.logSuccess(methodName, duration, params);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.logError(methodName, duration, error, params);
      throw error;
    }
  }

  async create(params: SubscriptionParams): Promise<SubscriptionEntity> {
    return this.logAndExecute('create', params, () =>
      this.wrapped.create(params),
    );
  }

  async findOne(
    email: string,
    city: string,
  ): Promise<SubscriptionEntity | null> {
    const params = { email, city };
    return this.logAndExecute('findOne', params, () =>
      this.wrapped.findOne(email, city),
    );
  }

  async delete(subscriptionId: string): Promise<SubscriptionEntity> {
    const params = { subscriptionId };
    return this.logAndExecute('delete', params, () =>
      this.wrapped.delete(subscriptionId),
    );
  }

  async confirm(subscriptionId: string): Promise<SubscriptionEntity> {
    const params = { subscriptionId };
    return this.logAndExecute('confirm', params, () =>
      this.wrapped.confirm(subscriptionId),
    );
  }

  async findByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]> {
    const params = { frequency };
    return this.logAndExecute('findByFrequency', params, () =>
      this.wrapped.findByFrequency(frequency),
    );
  }

  async deleteUnconfirmed(): Promise<{ count: number }> {
    return this.logAndExecute('deleteUnconfirmed', {}, () =>
      this.wrapped.deleteUnconfirmed(),
    );
  }
}
