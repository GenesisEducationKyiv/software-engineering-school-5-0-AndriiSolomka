import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  ActionResponse,
  ConfirmRequest,
  DeleteUnconfirmedResponse,
  Frequency,
  SubscribeRequest,
  SubscribeResponse,
  SubscriptionEntity,
  UnsubscribeRequest,
} from 'libs/proto/generated/subscription';

import { mapDomainToProto, mapProtoToDomain } from './frequency.mapper';
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
    data: Frequency,
  ): Promise<{ subscriptions: SubscriptionEntity[] }> {
    const frequency = mapProtoToDomain(data);
    const subs = await this.subscriptionHandlers.getByFrequency(frequency);

    const subscriptions = subs.map((sub) => ({
      ...sub,
      frequency: mapDomainToProto(sub.frequency),
    }));

    return { subscriptions };
  }

  @GrpcMethod('SubscriptionService', 'DeleteUnconfirmed')
  async deleteUnconfirmed(): Promise<DeleteUnconfirmedResponse> {
    return this.subscriptionHandlers.deleteUnconfirmed();
  }
}
