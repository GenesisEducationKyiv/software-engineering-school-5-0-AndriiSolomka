import { Module } from '@nestjs/common';
import { TokenModule } from '../token/token.module';
import { SubscriptionDomainModule } from './subscription-domain.module';
import { GeocodingModule } from '../infrastructure/geocoding.module';
import { SubscriptionHandlersService } from '../../subscription/subscription-handler.service';
import { SubscriptionHandlersController } from 'src/interface/controllers/subscription.controller';
import { PrismaModule } from '../infrastructure/prisma.module';
import { EmailModule } from '../notification/email.module';

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
