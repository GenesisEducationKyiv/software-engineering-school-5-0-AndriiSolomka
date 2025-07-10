import { Module } from '@nestjs/common';
import { TokenInterfaceToken } from 'src/core/abstracts/token/token-interface';
import { TokenRepositoryToken } from 'src/core/abstracts/token/token-repository.interface';
import { HttpClientModule } from 'src/libs/http/http-client.module';

import { PrismaTokenRepository } from './repositories/prisma-token.repository';
import { TokenService } from './services/token.service';
import { PrismaModule } from '../infrastructure/database/prisma.module';

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
