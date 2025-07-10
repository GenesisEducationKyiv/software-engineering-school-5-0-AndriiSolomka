import { Module } from '@nestjs/common';
import { HttpClientModule } from 'src/application/modules/infrastructure/http-client.module';
import { TokenInterfaceToken } from 'src/core/abstracts/token/token-interface';
import { TokenRepositoryToken } from 'src/core/abstracts/token/token-repository.interface';

import { TokenInternalController } from './controllers/token.controller';
import { PrismaTokenRepository } from './domain/repositories/prisma-token.repository';
import { TokenService } from './domain/services/token.service';
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
  ],
  exports: [TokenService],
})
export class InternalTokenModule {}
