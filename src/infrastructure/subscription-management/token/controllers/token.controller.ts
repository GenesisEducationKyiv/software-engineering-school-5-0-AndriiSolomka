import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { TokenInterfaceToken } from 'src/core/abstracts/token/token-interface';
import { TokenEntity } from 'src/core/entities/subscription.entity';

import { TokenService } from '../domain/services/token.service';

@Controller('internal/token')
export class TokenInternalController {
  constructor(
    @Inject(TokenInterfaceToken)
    private readonly tokenService: TokenService,
  ) {}

  @Post('create')
  async create(
    @Body() body: { subscriptionId: number },
  ): Promise<{ token: string }> {
    const token = await this.tokenService.create(body.subscriptionId);
    return { token };
  }

  @Get(':token')
  async getEntity(@Param('token') token: string): Promise<TokenEntity> {
    return await this.tokenService.getEntity(token);
  }
}
