import { Module } from '@nestjs/common';
import { GeocodingModule } from 'libs/infrastructure/geocoding/geocoding.module';

import { SubscriptionHandlersController } from '../../gateway/src/subscription/interface/subscription.controller';
import { SubscriptionGrpcClient } from '../controllers/subscription.grpc.client';

@Module({
  imports: [GeocodingModule],
  controllers: [SubscriptionHandlersController],
  providers: [SubscriptionGrpcClient],
})
export class SubscriptionControllersModule {}
