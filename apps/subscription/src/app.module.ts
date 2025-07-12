import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { InternalEmailModule } from 'apps/email/src/email.module';
import { GeocodingConfig } from 'libs/config/geocoding.config';
import { LoggingConfig } from 'libs/config/logging.config';
import { GeocodingModule } from 'libs/infrastructure/geocoding/geocoding.module';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { SubscriptionModule } from './infrastructure/modules/subscription.module';
import { TokenModule } from './infrastructure/modules/token.module';
import { SubscriptionHandlersService } from './infrastructure/services/subscription-application.service';
import { SubscriptionApiClient } from './interface/clients/application.client';
import { SubscriptionGrpcController } from './interface/controllers/subscription.controller';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({}),
    SubscriptionModule,
    TokenModule,
    HttpClientModule,
    InternalEmailModule,
    GeocodingModule,
  ],
  controllers: [SubscriptionGrpcController],
  providers: [
    SubscriptionHandlersService,
    SubscriptionApiClient,
    GeocodingConfig,
    LoggingConfig,
  ],
})
export class AppModule {}
