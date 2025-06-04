import { Module } from '@nestjs/common';
import { SubscriptionRepository } from './subscription-domain.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SubscriptionDomainService } from './subscription-domain.service';
import { TokenModule } from 'src/token/token.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [PrismaModule, TokenModule, EmailModule],
  providers: [SubscriptionRepository, SubscriptionDomainService],
  exports: [SubscriptionDomainService],
})
export class SubscriptionDomainModule {}
