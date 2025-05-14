import { Injectable } from '@nestjs/common';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly emailService: EmailService) {}

  async subscribe(dto: CreateSubscribeDto) {
    // Здесь должна быть проверка: если email уже подписан на этот город — выбросить ошибку
    // Например:
    // const exists = await this.prisma.subscription.findUnique({ where: { email_city: { email: dto.email, city: dto.city } } });
    // if (exists) throw new ConflictException('Email already subscribed');

    // Здесь должна быть логика создания подписки в базе (и генерация токена подтверждения)
    // const subscription = await this.prisma.subscription.create({ data: { ...dto, confirmed: false } });
    // const token = ... // сгенерировать токен

    // Отправляем письмо с подтверждением (здесь token должен быть реальным)
    await this.emailService.sendConfirmationEmail(
      dto.email,
      'confirmation-token',
    );

    return { message: 'Subscription successful. Confirmation email sent.' };
  }
}
