import { Module } from '@nestjs/common';
import { SubscriptionManagementModule } from 'src/infrastructure/subscription-management/subscription-management.module';
import { SubscriptionHandlersController } from 'src/interface/controllers/subscription.controller';
import { GeocodingModule } from 'src/libs/infrastructure/geocoding/geocoding.module';

@Module({
  imports: [SubscriptionManagementModule, GeocodingModule],
  controllers: [SubscriptionHandlersController],
})
export class SubscriptionControllersModule {}
