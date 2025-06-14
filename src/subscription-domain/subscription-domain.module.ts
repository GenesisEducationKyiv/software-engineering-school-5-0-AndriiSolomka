import { Module } from '@nestjs/common';
import { PrismaSubscriptionRepository } from './subscription-domain.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SubscriptionDomainService } from './subscription-domain.service';
import { TokenModule } from 'src/token/token.module';
import { EmailModule } from 'src/email/email.module';
import { SubscriptionRepositoryToken } from './interfaces/subscription-repository.interface';

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
