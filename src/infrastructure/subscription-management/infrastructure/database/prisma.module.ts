import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { LoggerModule } from 'src/infrastructure/libs/logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
