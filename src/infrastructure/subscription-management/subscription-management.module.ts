import { Module } from '@nestjs/common';

import { InternalHandlerModule } from './application/handlers.module';
import { InternalSubscriptionModule } from './subscription/subscription.module';
import { InternalTokenModule } from './token/token.module';

@Module({
  imports: [
    InternalHandlerModule,
    InternalSubscriptionModule,
    InternalTokenModule,
  ],
  exports: [
    InternalHandlerModule,
    InternalSubscriptionModule,
    InternalTokenModule,
  ],
})
export class SubscriptionManagementModule {}
