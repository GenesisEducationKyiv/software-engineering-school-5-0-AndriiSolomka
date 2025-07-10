import { Module } from '@nestjs/common';
import { GeocodingModule } from 'src/infrastructure/libs/geocoding/geocoding.module';
import { InternalHandlerModule } from 'src/infrastructure/subscription-management/application/handlers.module';
import { SubscriptionHandlersController } from 'src/interface/controllers/subscription.controller';

@Module({
  imports: [InternalHandlerModule, GeocodingModule],
  controllers: [SubscriptionHandlersController],
})
export class SubscriptionControllersModule {}
