import { Module } from '@nestjs/common';
import { InternalEmailModule } from 'src/infrastructure/email/email.module';
import { GeocodingModule } from 'src/libs/infrastructure/geocoding/geocoding.module';
import { HttpClientModule } from 'src/libs/infrastructure/http/http-client.module';

import { SubscriptionApiClient } from './application.client';
import { InternalSubscriptionModule } from './infrastructure/modules/subscription.module';
import { InternalTokenModule } from './infrastructure/modules/token.module';
import { SubscriptionApplicationService } from './infrastructure/services/subscription-application.service';
import { SubscriptionController } from './interface/controllers/subscription.controller';

@Module({
  imports: [
    InternalSubscriptionModule,
    InternalTokenModule,
    HttpClientModule,
    InternalEmailModule,
    GeocodingModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionApplicationService, SubscriptionApiClient],
  exports: [SubscriptionApiClient],
})
export class SubscriptionManagementModule {}
