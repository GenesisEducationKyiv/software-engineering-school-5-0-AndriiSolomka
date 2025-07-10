import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/libs/logger/logger.module';

import { PrismaService } from './prisma.service';

@Module({
  imports: [LoggerModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
