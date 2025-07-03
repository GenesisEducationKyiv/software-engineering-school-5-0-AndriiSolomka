import { Module } from '@nestjs/common';
import { SubscriptionHandlersController } from 'src/interface/controllers/subscription.controller';

import { SubscriptionDomainModule } from './subscription-domain.module';
import { SubscriptionHandlersService } from '../../subscription/subscription-handler.service';
import { GeocodingModule } from '../infrastructure/geocoding.module';
import { PrismaModule } from '../infrastructure/prisma.module';
import { EmailModule } from '../notification/email.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    PrismaModule,
    TokenModule,
    EmailModule,
    SubscriptionDomainModule,
    GeocodingModule,
  ],
  providers: [SubscriptionHandlersService],
  controllers: [SubscriptionHandlersController],
})
export class SubscriptionHandlersModule {}
