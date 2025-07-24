import { Module } from '@nestjs/common';
import { TokenInterfaceToken } from 'src/infrastructure/subscription-management/core/token/token-interface';
import { TokenRepositoryToken } from 'src/infrastructure/subscription-management/core/token/token-repository.interface';
import { PrismaModule } from 'src/infrastructure/subscription-management/infrastructure/database/prisma.module';
import { PrismaTokenRepository } from 'src/infrastructure/subscription-management/infrastructure/repositories/prisma-token.repository';
import { TokenService } from 'src/infrastructure/subscription-management/infrastructure/services/token.service';
import { HttpClientModule } from 'src/libs/infrastructure/http/http-client.module';

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
