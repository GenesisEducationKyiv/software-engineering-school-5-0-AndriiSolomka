import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { TokenModule } from './token.module';
import { EmailModule } from './email.module';
import { SubscriptionDomainModule } from './subscription-domain.module';
import { GeocodingModule } from './geocoding.module';
import { SubscriptionHandlersService } from '../subscription/subscription-handler.service';
import { SubscriptionHandlersController } from 'src/interface/controllers/subscription.controller';

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
