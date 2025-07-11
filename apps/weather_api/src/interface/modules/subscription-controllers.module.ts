import { Module } from '@nestjs/common';
import { SubscriptionManagementModule } from 'apps/weather_api/src/infrastructure/subscription-management/subscription-management.module';
import { SubscriptionHandlersController } from 'apps/weather_api/src/interface/controllers/subscription.controller';
import { GeocodingModule } from 'libs/infrastructure/geocoding/geocoding.module';

@Module({
  imports: [SubscriptionManagementModule, GeocodingModule],
  controllers: [SubscriptionHandlersController],
})
export class SubscriptionControllersModule {}
