import { Module } from '@nestjs/common';
import { TokenRepositoryToken } from 'src/core/abstracts/token/token.interface';
import { PrismaTokenRepository } from 'src/infrastructure/repository/prisma-token.repository';
import { TokenService } from 'src/use-cases/token/token.service';

import { PrismaModule } from '../infrastructure/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaTokenRepository,
    TokenService,
    {
      provide: TokenRepositoryToken,
      useClass: PrismaTokenRepository,
    },
  ],
  exports: [TokenService],
})
export class TokenModule {}
