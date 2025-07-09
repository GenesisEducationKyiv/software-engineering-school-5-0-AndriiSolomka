import { Module } from '@nestjs/common';
import { InternalSubscriptionModule } from 'src/infrastructure/api/modules/subscription/subscription.module';
import { InternalEmailModule } from 'src/infrastructure/email/email.module';

import { SubscriptionDomainModule } from './subscription-domain.module';
import { SubscriptionHandlersUseCase } from '../../../use-cases/subscription/subscription-handler.use-case';
import { GeocodingModule } from '../infrastructure/geocoding.module';
import { PrismaModule } from '../infrastructure/prisma.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    PrismaModule,
    TokenModule,
    InternalEmailModule,
    SubscriptionDomainModule,
    GeocodingModule,
    InternalEmailModule,
    InternalSubscriptionModule,
  ],
  providers: [SubscriptionHandlersUseCase],
  exports: [SubscriptionHandlersUseCase],
})
export class SubscriptionHandlersModule {}
