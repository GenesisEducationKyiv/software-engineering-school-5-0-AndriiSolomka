import { Module } from '@nestjs/common';
import { TokenRepository } from './token.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenService } from './token.service';
import { ITokenRepositoryToken } from './interfaces/token-repository.interface';

@Module({
  imports: [PrismaModule],
  providers: [
    TokenRepository,
    TokenService,
    {
      provide: ITokenRepositoryToken,
      useClass: TokenRepository,
    },
  ],
  exports: [TokenService],
})
export class TokenModule {}
