import { Module } from '@nestjs/common';
import { SubscriptionRepository } from './subscription-domain.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SubscriptionDomainService } from './subscription-domain.service';
import { TokenModule } from 'src/token/token.module';
import { EmailModule } from 'src/email/email.module';
import { ISubscriptionRepositoryToken } from './interfaces/subscription-repository.interface';

@Module({
  imports: [PrismaModule, TokenModule, EmailModule],
  providers: [
    SubscriptionRepository,
    SubscriptionDomainService,
    {
      provide: ISubscriptionRepositoryToken,
      useClass: SubscriptionRepository,
    },
  ],
  exports: [SubscriptionDomainService],
})
export class SubscriptionDomainModule {}
