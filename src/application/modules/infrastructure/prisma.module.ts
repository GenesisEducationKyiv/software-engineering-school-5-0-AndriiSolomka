import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

import { LoggerModule } from './logger.module';

@Module({
  imports: [LoggerModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
