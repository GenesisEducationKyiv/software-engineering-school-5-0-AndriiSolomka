import { Module } from '@nestjs/common';
import { InternalEmailModule } from 'src/infrastructure/email/email.module';
import { HttpClientModule } from 'src/libs/http/http-client.module';

import { InternalSubscriptionModule } from '../subscription/subscription.module';
import { InternalTokenModule } from '../token/token.module';
import { SubscriptionApiClient } from './api/clients/application.client';
import { SubscriptionController } from './api/controllers/subscription.controller';
import { SubscriptionHandlersService } from './services/subscription-application.service';

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
export class InternalHandlerModule {}
