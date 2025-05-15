import { Module } from '@nestjs/common';
import { SubscriptionRepository } from './subscription.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SubscriptionService } from './subscription.service';
import { TokenModule } from 'src/token/token.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [PrismaModule, TokenModule, EmailModule],
  providers: [SubscriptionRepository, SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
