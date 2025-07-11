import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  EmailInterface,
  EmailToken,
} from 'src/infrastructure/email/core/email.interface';

import { SendConfirmationEmailDto, SendWeatherEmailDto } from './dto/email.dto';

@Controller('/internal/email')
export class EmailInternalController {
  constructor(
    @Inject(EmailToken)
    private readonly emailService: EmailInterface,
  ) {}

  @Post('send-confirmation')
  async sendConfirmationEmail(
    @Body() { email, token }: SendConfirmationEmailDto,
  ): Promise<{ success: boolean }> {
    await this.emailService.sendConfirmationEmail(email, token);
    return { success: true };
  }

  @Post('send-weather')
  async sendWeatherEmail(
    @Body() { email, subject, text }: SendWeatherEmailDto,
  ): Promise<{ success: boolean }> {
    await this.emailService.sendWeatherEmail({ email, subject, text });
    return { success: true };
  }
}
