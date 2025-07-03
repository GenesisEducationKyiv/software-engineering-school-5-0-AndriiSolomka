import { Module } from '@nestjs/common';
import { TokenModule } from '../token/token.module';
import { PrismaSubscriptionRepository } from 'src/infrastructure/repository/prisma-subscription.repository';
import { SubscriptionDomainService } from 'src/use-cases/subscription/subscription-domain.service';
import { SubscriptionRepositoryToken } from 'src/core/abstracts/subscription/subscription-repository.interface';
import { EmailModule } from '../notification/email.module';
import { PrismaModule } from '../infrastructure/prisma.module';

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
