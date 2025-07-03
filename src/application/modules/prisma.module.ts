import { Module } from '@nestjs/common';
import { LoggerModule } from './logger.module';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Module({
  imports: [LoggerModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
