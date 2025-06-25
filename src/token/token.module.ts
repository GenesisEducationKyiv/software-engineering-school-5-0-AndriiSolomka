import { Module } from '@nestjs/common';
import { PrismaTokenRepository } from './token.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenService } from './token.service';
import { TokenRepositoryToken } from './interfaces/token-repository.interface';

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
