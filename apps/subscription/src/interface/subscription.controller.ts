import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  ActionResponse,
  ConfirmRequest,
  SubscribeRequest,
  UnsubscribeRequest,
} from 'libs/proto/generated/subscription';

import { mapProtoToDomain } from '../infrastructure/mappers/frequency.mapper';
import { SubscriptionHandlersService } from '../infrastructure/services/subscription-application.service';

@Controller()
export class SubscriptionGrpcController {
  constructor(
    private readonly subscriptionHandlers: SubscriptionHandlersService,
  ) {}

  @GrpcMethod('SubscriptionService', 'Subscribe')
  async subscribe(data: SubscribeRequest) {
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
}
