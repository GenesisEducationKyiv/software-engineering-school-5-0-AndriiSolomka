import { Module } from '@nestjs/common';
import { TokenRepositoryToken } from 'src/core/abstracts/token/token-repository.interface';
import { PrismaTokenRepository } from 'src/infrastructure/repository/prisma-token.repository';
import { TokenUseCase } from 'src/use-cases/token/token.use-case';

import { PrismaModule } from '../infrastructure/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaTokenRepository,
    TokenUseCase,
    {
      provide: TokenRepositoryToken,
      useClass: PrismaTokenRepository,
    },
  ],
  exports: [TokenUseCase],
})
export class TokenModule {}
