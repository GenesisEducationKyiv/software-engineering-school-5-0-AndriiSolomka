import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { TokenModule } from './token.module';
import { EmailModule } from './email.module';
import { PrismaSubscriptionRepository } from 'src/infrastructure/repository/prisma-subscription.repository';
import { SubscriptionDomainService } from 'src/use-cases/subscription/subscription-domain.service';
import { SubscriptionRepositoryToken } from 'src/core/abstracts/subscription/subscription-repository.interface';

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
