import { Module } from '@nestjs/common';
import { InternalHandlerModule } from 'src/infrastructure/subscription-management/application/handlers.module';
import { SubscriptionHandlersController } from 'src/interface/controllers/subscription.controller';
import { GeocodingModule } from 'src/libs/geocoding/geocoding.module';

@Module({
  imports: [InternalHandlerModule, GeocodingModule],
  controllers: [SubscriptionHandlersController],
})
export class SubscriptionControllersModule {}
