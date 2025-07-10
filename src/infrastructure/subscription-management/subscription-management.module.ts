import { Module } from '@nestjs/common';
import { InternalEmailModule } from 'src/infrastructure/email/email.module';
import { HttpClientModule } from 'src/libs/http/http-client.module';

import { SubscriptionApiClient } from './application/api/clients/application.client';
import { SubscriptionController } from './application/api/controllers/subscription.controller';
import { SubscriptionHandlersService } from './application/services/subscription-application.service';
import { InternalSubscriptionModule } from './subscription/subscription.module';
import { InternalTokenModule } from './token/token.module';

@Module({
  imports: [
    InternalSubscriptionModule,
    InternalTokenModule,
    HttpClientModule,
    InternalEmailModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionHandlersService, SubscriptionApiClient],
  exports: [SubscriptionApiClient],
})
export class SubscriptionManagementModule {}
