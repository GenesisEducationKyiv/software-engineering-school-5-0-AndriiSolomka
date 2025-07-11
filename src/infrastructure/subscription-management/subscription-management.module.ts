import { Module } from '@nestjs/common';
import { InternalEmailModule } from 'src/infrastructure/email/email.module';
import { HttpClientModule } from 'src/libs/infrastructure/http/http-client.module';

import { InternalSubscriptionModule } from './infrastructure/modules/subscription.module';
import { InternalTokenModule } from './infrastructure/modules/token.module';
import { SubscriptionHandlersService } from './infrastructure/services/subscription-application.service';
import { SubscriptionApiClient } from './interface/clients/application.client';
import { SubscriptionController } from './interface/controllers/subscription.controller';

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
