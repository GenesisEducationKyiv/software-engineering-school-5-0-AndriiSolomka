import { Module } from '@nestjs/common';
import { HttpClientModule } from 'src/application/modules/infrastructure/http-client.module';
import { PrismaModule } from 'src/application/modules/infrastructure/prisma.module';
import { TokenInterfaceToken } from 'src/core/abstracts/token/token-interface';
import { TokenRepositoryToken } from 'src/core/abstracts/token/token-repository.interface';

import { PrismaTokenRepository } from './repositories/prisma-token.repository';
import { TokenService } from './services/token.service';
import { TokenApiClient } from '../clients/token-api.client';

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
    TokenApiClient,
  ],
  exports: [TokenApiClient],
})
export class InternalTokenModule {}
