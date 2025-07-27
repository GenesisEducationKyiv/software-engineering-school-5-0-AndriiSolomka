import { LoggerInterface } from 'libs/core/logger/logger.interface';

import {
  Frequency,
  SubscriptionEntity,
} from '../../core/entities/subscription.entity';
import { SubscriptionParams } from '../../core/subscription/subscription-repository.interface';
import { SubscriptionInterface } from '../../core/subscription/subscription.interface';

export class LoggingSubscriptionServiceDecorator {
  constructor(
    private readonly wrapped: SubscriptionInterface,
    private readonly logger: LoggerInterface,
    private readonly context: string = 'SubscriptionService',
  ) {}

  async create(data: SubscriptionParams): Promise<SubscriptionEntity> {
    this.logger.info({
      context: this.context,
      method: 'create',
      data,
      event: 'called',
    });
    try {
      const result = await this.wrapped.create(data);
      this.logger.info({
        context: this.context,
        method: 'create',
        event: 'success',
        email: result.email,
        city: result.city,
      });
      return result;
    } catch (error) {
      this.logger.error({
        context: this.context,
        method: 'create',
        event: 'error',
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async confirm(subscriptionId: string): Promise<SubscriptionEntity> {
    this.logger.info({
      context: this.context,
      method: 'confirm',
      subscriptionId,
      event: 'called',
    });
    try {
      const result = await this.wrapped.confirm(subscriptionId);
      this.logger.info({
        context: this.context,
        method: 'confirm',
        event: 'success',
      });
      return result;
    } catch (error) {
      this.logger.error({
        context: this.context,
        method: 'confirm',
        event: 'error',
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async delete(subscriptionId: string): Promise<SubscriptionEntity> {
    this.logger.info({
      context: this.context,
      method: 'delete',
      subscriptionId,
      event: 'called',
    });
    try {
      const result = await this.wrapped.delete(subscriptionId);
      this.logger.info({
        context: this.context,
        method: 'delete',
        event: 'success',
      });
      return result;
    } catch (error) {
      this.logger.error({
        context: this.context,
        method: 'delete',
        event: 'error',
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async getByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]> {
    this.logger.info({
      context: this.context,
      method: 'getByFrequency',
      frequency,
      event: 'called',
    });
    try {
      const result = await this.wrapped.getByFrequency(frequency);
      this.logger.info({
        context: this.context,
        method: 'getByFrequency',
        event: 'success',
        count: result.length,
      });
      return result;
    } catch (error) {
      this.logger.error({
        context: this.context,
        method: 'getByFrequency',
        event: 'error',
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async deleteUnconfirmed(): Promise<{ count: number }> {
    this.logger.info({
      context: this.context,
      method: 'deleteUnconfirmed',
      event: 'called',
    });
    try {
      const result = await this.wrapped.deleteUnconfirmed();
      this.logger.info({
        context: this.context,
        method: 'deleteUnconfirmed',
        event: 'success',
        count: result.count,
      });
      return result;
    } catch (error) {
      this.logger.error({
        context: this.context,
        method: 'deleteUnconfirmed',
        event: 'error',
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
