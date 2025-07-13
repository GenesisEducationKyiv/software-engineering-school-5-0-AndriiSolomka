import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
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
  ],
  controllers: [SubscriptionGrpcController],
  providers: [SubscriptionHandlersService],
})
export class AppModule {}
