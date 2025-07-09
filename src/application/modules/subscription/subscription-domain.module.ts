import { Module } from '@nestjs/common';
import { SubscriptionRepositoryToken } from 'src/core/abstracts/subscription/subscription-repository.interface';
import { InternalEmailModule } from 'src/infrastructure/email/email.module';
import { PrismaSubscriptionRepository } from 'src/infrastructure/repository/prisma-subscription.repository';
import { SubscriptionDomainUseCase } from 'src/use-cases/subscription/subscription-domain.use-case';

import { PrismaModule } from '../infrastructure/prisma.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [PrismaModule, TokenModule, InternalEmailModule],
  providers: [
    PrismaSubscriptionRepository,
    SubscriptionDomainUseCase,
    {
      provide: SubscriptionRepositoryToken,
      useClass: PrismaSubscriptionRepository,
    },
  ],
  exports: [SubscriptionDomainUseCase],
})
export class SubscriptionDomainModule {}
