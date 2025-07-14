import { Module } from '@nestjs/common';
import { SubscriptionRepositoryToken } from 'src/infrastructure/subscription-management/core/subscription/subscription-repository.interface';
import { SubscriptionToken } from 'src/infrastructure/subscription-management/core/subscription/subscription.interface';
import { PrismaModule } from 'src/infrastructure/subscription-management/infrastructure/database/prisma.module';
import { PrismaSubscriptionRepository } from 'src/infrastructure/subscription-management/infrastructure/repositories/prisma-subscription.repository';
import { SubscriptionService } from 'src/infrastructure/subscription-management/infrastructure/services/subscription.service';
import { HttpClientModule } from 'src/libs/infrastructure/http/http-client.module';

@Module({
  imports: [PrismaModule, HttpClientModule],
  providers: [
    SubscriptionService,
    {
      provide: SubscriptionRepositoryToken,
      useClass: PrismaSubscriptionRepository,
    },
    {
      provide: SubscriptionToken,
      useClass: SubscriptionService,
    },
  ],
  exports: [SubscriptionService],
})
export class InternalSubscriptionModule {}
