import { Module } from '@nestjs/common';
import { TokenInterfaceToken } from 'src/infrastructure/subscription-management/core/token/token-interface';
import { TokenRepositoryToken } from 'src/infrastructure/subscription-management/core/token/token-repository.interface';
import { HttpClientModule } from 'src/libs/infrastructure/http/http-client.module';

import { PrismaModule } from '../database/prisma.module';
import { PrismaTokenRepository } from '../repositories/prisma-token.repository';
import { TokenService } from '../services/token.service';

@Module({
  imports: [PrismaModule, HttpClientModule],
  providers: [
    PrismaTokenRepository,
    TokenService,
    {
      provide: TokenRepositoryToken,
      useClass: PrismaTokenRepository,
    },
    {
      provide: TokenInterfaceToken,
      useClass: TokenService,
    },
  ],
  exports: [TokenService],
})
export class InternalTokenModule {}
