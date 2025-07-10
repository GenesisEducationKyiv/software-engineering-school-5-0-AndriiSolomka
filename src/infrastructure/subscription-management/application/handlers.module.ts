import { Module } from '@nestjs/common';
import { HttpClientModule } from 'src/application/modules/infrastructure/http-client.module';
import { InternalEmailModule } from 'src/infrastructure/email/email.module';

import { InternalSubscriptionModule } from '../subscription/subscription.module';
import { SubscriptionController } from './api/controllers/subscription.controller';
import { InternalTokenModule } from '../token/token.module';
import { HandlersApiClient } from './api/clients/aplication.client';
import { SubscriptionHandlersService } from './domain/services/subscription-application.service';

@Module({
  imports: [
    InternalSubscriptionModule,
    InternalTokenModule,
    HttpClientModule,
    InternalEmailModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionHandlersService, HandlersApiClient],
  exports: [HandlersApiClient],
})
export class InternalHandlerModule {}
