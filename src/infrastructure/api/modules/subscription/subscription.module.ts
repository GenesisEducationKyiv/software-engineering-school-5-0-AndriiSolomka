import { Module } from '@nestjs/common';
import { HttpClientModule } from 'src/application/modules/infrastructure/http-client.module';
import { SubscriptionDomainModule } from 'src/application/modules/subscription/subscription-domain.module';

import { SubscriptionInternalController } from '../../controllers/subscription/subscription.controller';
import { SubscriptionApiClient } from '../../services/subscription/subscription.service';

@Module({
  imports: [HttpClientModule, SubscriptionDomainModule],
  controllers: [SubscriptionInternalController],
  providers: [SubscriptionApiClient],
  exports: [SubscriptionApiClient],
})
export class InternalSubscriptionModule {}
