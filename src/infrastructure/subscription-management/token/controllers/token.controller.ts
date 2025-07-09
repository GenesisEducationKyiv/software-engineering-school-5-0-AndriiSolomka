import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { TokenInterfaceToken } from 'src/core/abstracts/token/token-interface';
import { TokenEntity } from 'src/core/entities/subscription.entity';

import { TokenService } from '../services/token.service';

@Controller('internal/token')
export class TokenInternalController {
  constructor(
    @Inject(TokenInterfaceToken)
    private readonly tokenService: TokenService,
  ) {}

  @Post('create')
  async create(@Body() body: { subscriptionId: number }): Promise<string> {
    return await this.tokenService.create(body.subscriptionId);
  }

  @Get(':token')
  async getEntity(@Param('token') token: string): Promise<TokenEntity> {
    return await this.tokenService.getEntity(token);
  }
}
