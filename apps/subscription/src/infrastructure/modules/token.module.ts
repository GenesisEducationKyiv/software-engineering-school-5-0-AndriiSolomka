import { Module } from '@nestjs/common';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { TokenInterfaceToken } from '../../core/token/token-interface';
import { TokenRepositoryToken } from '../../core/token/token-repository.interface';
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
