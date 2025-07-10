import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/subscription-management/database/prisma.service';

import { LoggerModule } from '../../../application/modules/infrastructure/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
