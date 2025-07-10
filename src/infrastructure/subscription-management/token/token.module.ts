import { Module } from '@nestjs/common';
import { HttpClientModule } from 'src/application/modules/infrastructure/http-client.module';
import { TokenInterfaceToken } from 'src/core/abstracts/token/token-interface';
import { TokenRepositoryToken } from 'src/core/abstracts/token/token-repository.interface';

import { PrismaTokenRepository } from './domain/repositories/prisma-token.repository';
import { TokenService } from './domain/services/token.service';
import { TokenApiClient } from './api/clients/token.client';
import { TokenInternalController } from './api/controllers/token.controller';
import { PrismaModule } from '../infrastructure/database/prisma.module';

@Module({
  imports: [PrismaModule, HttpClientModule],
  controllers: [TokenInternalController],

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
