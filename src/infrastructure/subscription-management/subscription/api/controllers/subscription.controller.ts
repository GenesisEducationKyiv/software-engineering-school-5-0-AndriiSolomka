import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  SubscriptionInterface,
  SubscriptionToken,
} from 'src/core/abstracts/subscription/subscription.interface';
import { Frequency } from 'src/core/entities/subscription.entity';

import { CreateSubscriptionDto } from './dto/subscription.dto';

@Controller('/internal/subscription')
export class SubscriptionInternalController {
  constructor(
    @Inject(SubscriptionToken)
    private readonly subService: SubscriptionInterface,
  ) {}

  @Post()
  async create(@Body() dto: CreateSubscriptionDto) {
    return await this.subService.create(dto);
  }

  @Post('confirm/:id')
  async confirm(@Param('id', ParseIntPipe) id: number) {
    return await this.subService.confirm(id);
  }

  @Post('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.subService.delete(id);
  }

  @Get('by-frequency/:frequency')
  async getByFrequency(@Param('frequency') frequency: Frequency) {
    return await this.subService.getByFrequency(frequency);
  }

  @Post('delete-unconfirmed')
  async deleteUnconfirmed() {
    return await this.subService.deleteUnconfirmed();
  }
}
