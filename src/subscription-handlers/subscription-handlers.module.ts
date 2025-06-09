import { Module } from '@nestjs/common';
import { SubscriptionHandlersService } from './subscription-handlers.service';
import { SubscriptionHandlersController } from './subscription-handlers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';
import { EmailModule } from 'src/email/email.module';
import { SubscriptionDomainModule } from 'src/subscription-domain/subscription-domain.module';
import { CityModule } from 'src/city/city.module';

@Module({
  imports: [
    PrismaModule,
    TokenModule,
    EmailModule,
    SubscriptionDomainModule,
    CityModule,
  ],
  providers: [SubscriptionHandlersService],
  controllers: [SubscriptionHandlersController],
})
export class SubscriptionHandlersModule {}
