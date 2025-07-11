import { Module } from '@nestjs/common';
import { SubscriptionManagementModule } from 'apps/subscription/src/subscription.module';
import { GeocodingModule } from 'libs/infrastructure/geocoding/geocoding.module';

import { SubscriptionHandlersController } from '../controllers/subscription.controller';

@Module({
  imports: [SubscriptionManagementModule, GeocodingModule],
  controllers: [SubscriptionHandlersController],
})
export class SubscriptionControllersModule {}
