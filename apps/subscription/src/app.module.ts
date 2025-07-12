import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { GeocodingConfig } from 'libs/config/geocoding.config';
import { LoggingConfig } from 'libs/config/logging.config';
import { GeocodingModule } from 'libs/infrastructure/geocoding/geocoding.module';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { SubscriptionModule } from './infrastructure/modules/subscription.module';
import { TokenModule } from './infrastructure/modules/token.module';
import { SubscriptionHandlersService } from './infrastructure/services/subscription-application.service';
import { SubscriptionGrpcController } from './interface/subscription.controller';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({}),
    SubscriptionModule,
    TokenModule,
    HttpClientModule,
    GeocodingModule,
  ],
  controllers: [SubscriptionGrpcController],
  providers: [SubscriptionHandlersService, GeocodingConfig, LoggingConfig],
})
export class AppModule {}
