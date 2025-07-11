import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { InternalEmailModule } from 'apps/email/email.module';
import { GeocodingConfig } from 'libs/config/geocoding.config';
import { LoggingConfig } from 'libs/config/logging.config';
import { GeocodingModule } from 'libs/infrastructure/geocoding/geocoding.module';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { InternalSubscriptionModule } from './infrastructure/modules/subscription.module';
import { InternalTokenModule } from './infrastructure/modules/token.module';
import { SubscriptionHandlersService } from './infrastructure/services/subscription-application.service';
import { SubscriptionApiClient } from './interface/clients/application.client';
import { SubscriptionController } from './interface/controllers/subscription.controller';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({}),
    InternalSubscriptionModule,
    InternalTokenModule,
    HttpClientModule,
    InternalEmailModule,
    GeocodingModule,
  ],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionHandlersService,
    SubscriptionApiClient,
    GeocodingConfig,
    LoggingConfig,
  ],
  exports: [SubscriptionApiClient],
})
export class SubscriptionManagementModule {}
