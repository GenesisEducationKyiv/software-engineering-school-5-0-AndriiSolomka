import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Frequency } from 'src/core/entities/subscription.entity';
import { SubscriptionDomainUseCase } from 'src/use-cases/subscription/subscription-domain.use-case';

import { CreateSubscriptionDto } from '../../dto/subscription/subscription.dto';

@Controller('/internal/subscription')
export class SubscriptionInternalController {
  constructor(private readonly subService: SubscriptionDomainUseCase) {}

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
