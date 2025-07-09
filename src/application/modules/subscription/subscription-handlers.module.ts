import { Module } from '@nestjs/common';
import { InternalEmailModule } from 'src/infrastructure/email/email.module';
import { InternalSubscriptionModule } from 'src/infrastructure/subscription-management/subscription/subscription.module';
import { InternalTokenModule } from 'src/infrastructure/subscription-management/token/token.module';

import { SubscriptionHandlersUseCase } from '../../../use-cases/subscription/subscription-handler.use-case';
import { GeocodingModule } from '../infrastructure/geocoding.module';
import { PrismaModule } from '../infrastructure/prisma.module';

@Module({
  imports: [
    PrismaModule,
    InternalTokenModule,
    InternalEmailModule,
    InternalSubscriptionModule,
    GeocodingModule,
    InternalEmailModule,
    InternalSubscriptionModule,
  ],
  providers: [SubscriptionHandlersUseCase],
  exports: [SubscriptionHandlersUseCase],
})
export class SubscriptionHandlersModule {}
