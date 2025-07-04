import { Module } from '@nestjs/common';
import { EmailToken } from 'src/core/abstracts/email/email.interface';
import { EmailService } from 'src/infrastructure/email/email.service';

import { SubscriptionDomainModule } from './subscription-domain.module';
import { SubscriptionHandlersUseCase } from '../../../use-cases/subscription/subscription-handler.use-case';
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
  providers: [
    SubscriptionHandlersUseCase,
    {
      provide: EmailToken,
      useExisting: EmailService,
    },
  ],
  exports: [SubscriptionHandlersUseCase],
})
export class SubscriptionHandlersModule {}
