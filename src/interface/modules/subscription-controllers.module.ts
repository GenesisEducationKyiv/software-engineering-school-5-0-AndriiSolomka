import { Module } from '@nestjs/common';
import { GeocodingModule } from 'src/application/modules/infrastructure/geocoding.module';
import { SubscriptionHandlersModule } from 'src/application/modules/subscription/subscription-handlers.module';
import { SubscriptionHandlersController } from 'src/interface/controllers/subscription.controller';

@Module({
  imports: [SubscriptionHandlersModule, GeocodingModule],
  controllers: [SubscriptionHandlersController],
})
export class SubscriptionControllersModule {}
