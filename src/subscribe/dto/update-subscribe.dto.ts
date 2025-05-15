import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionDto } from './create-subscribe.dto';

export class UpdateSubscribeDto extends PartialType(CreateSubscriptionDto) {
  confirmed?: boolean;
}
