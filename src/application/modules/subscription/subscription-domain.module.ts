import { Module } from '@nestjs/common';
import { SubscriptionRepositoryToken } from 'src/core/abstracts/subscription/subscription-repository.interface';
import { PrismaSubscriptionRepository } from 'src/infrastructure/repository/prisma-subscription.repository';
import { SubscriptionDomainService } from 'src/use-cases/subscription/subscription-domain.service';

import { PrismaModule } from '../infrastructure/prisma.module';
import { EmailModule } from '../notification/email.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [PrismaModule, TokenModule, EmailModule],
  providers: [
    PrismaSubscriptionRepository,
    SubscriptionDomainService,
    {
      provide: SubscriptionRepositoryToken,
      useClass: PrismaSubscriptionRepository,
    },
  ],
  exports: [SubscriptionDomainService],
})
export class SubscriptionDomainModule {}
