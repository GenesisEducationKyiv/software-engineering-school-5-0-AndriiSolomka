import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  ActionResponse,
  ConfirmRequest,
  DeleteUnconfirmedResponse,
  GetByFrequencyRequest,
  GetByFrequencyResponse,
  SubscribeRequest,
  SubscribeResponse,
  SubscriptionEntity,
  UnsubscribeRequest,
} from 'libs/proto/generated/subscription';

import { mapProtoToDomain } from './frequency.mapper';
import { SubscriptionHandlersService } from '../infrastructure/services/subscription-application.service';

@Controller()
export class SubscriptionGrpcController {
  constructor(
    private readonly subscriptionHandlers: SubscriptionHandlersService,
  ) {}

  @GrpcMethod('SubscriptionService', 'Subscribe')
  async subscribe(data: SubscribeRequest): Promise<SubscribeResponse> {
    const domainParams = {
      email: data.email,
      city: data.city,
      frequency: mapProtoToDomain(data.frequency),
    };
    return await this.subscriptionHandlers.subscribe(domainParams);
  }

  @GrpcMethod('SubscriptionService', 'Confirm')
  async confirm(data: ConfirmRequest): Promise<ActionResponse> {
    return await this.subscriptionHandlers.confirm(data.token);
  }

  @GrpcMethod('SubscriptionService', 'Unsubscribe')
  async unsubscribe(data: UnsubscribeRequest): Promise<ActionResponse> {
    return await this.subscriptionHandlers.unsubscribe(data.token);
  }

  @GrpcMethod('SubscriptionService', 'GetByFrequency')
  async getByFrequency(
    data: GetByFrequencyRequest,
  ): Promise<GetByFrequencyResponse> {
    const frequency = mapProtoToDomain(data.frequency);
    const subs = await this.subscriptionHandlers.getByFrequency(frequency);

    const subscriptions: SubscriptionEntity[] = subs.map((sub) => ({
      email: sub.email,
      city: sub.city,
      tokens: sub.tokens.map((token) => ({ token: token.token })),
    }));

    return { subscriptions };
  }

  @GrpcMethod('SubscriptionService', 'DeleteUnconfirmed')
  async deleteUnconfirmed(): Promise<DeleteUnconfirmedResponse> {
    return this.subscriptionHandlers.deleteUnconfirmed();
  }
}
