import { Configuration, Value } from '@itgorillaz/configify';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@Configuration()
export class EmailConfig {
  @IsEmail()
  @IsNotEmpty()
  @Value('EMAIL_USER')
  user: string;

  @IsString()
  @IsNotEmpty()
  @Value('EMAIL_PASSWORD')
  password: string;

  @IsString()
  @IsNotEmpty()
  @Value('EMAIL_SERVICE')
  service: string;

  @Value('EMAIL_CONFIRM_LINK')
  confirmLink: string;

  @Value('EMAIL_UNSUBSCRIBE_LINK')
  unsubscribeLink: string;

  @Value('EMAIL_SUBJECT')
  subject: string;

  @Value('EMAIL_TEXT')
  text: string;
}
