import { Inject } from '@nestjs/common';
import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import {
  EmailInterface,
  EmailToken,
} from 'apps/email/src/email/core/email.interface';
import {
  SendConfirmationEmailRequest,
  SendWeatherEmailRequest,
  SuccessResponse,
} from 'libs/proto/generated/email';

@GrpcService()
export class EmailController {
  constructor(
    @Inject(EmailToken)
    private readonly emailService: EmailInterface,
  ) {}

  @GrpcMethod('EmailService', 'SendConfirmationEmail')
  async sendConfirmationEmail(
    data: SendConfirmationEmailRequest,
  ): Promise<SuccessResponse> {
    await this.emailService.sendConfirmationEmail(data.email, data.token);
    return { success: true };
  }

  @GrpcMethod('EmailService', 'SendWeatherEmail')
  async sendWeatherEmail(
    data: SendWeatherEmailRequest,
  ): Promise<SuccessResponse> {
    await this.emailService.sendWeatherEmail(data);
    return { success: true };
  }
}
