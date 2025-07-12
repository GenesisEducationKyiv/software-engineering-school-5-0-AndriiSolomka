import { Module } from '@nestjs/common';
import { GeocodingModule } from 'libs/infrastructure/geocoding/geocoding.module';

import { SubscriptionHandlersController } from '../controllers/subscription.controller';
import { SubscriptionGrpcClient } from '../controllers/subscription.grpc.client';

@Module({
  imports: [GeocodingModule],
  controllers: [SubscriptionHandlersController],
  providers: [SubscriptionGrpcClient],
})
export class SubscriptionControllersModule {}
