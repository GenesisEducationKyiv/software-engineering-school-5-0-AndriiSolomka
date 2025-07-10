import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { LoggerModule } from 'src/application/modules/infrastructure/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
