import { Module } from '@nestjs/common';
import { CashService } from './cash.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [CashService],
  exports: [CashService],
})
export class CashModule {}
