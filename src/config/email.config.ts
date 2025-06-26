import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  confirmLink: process.env.EMAIL_CONFIRM_LINK!,
  sender: process.env.EMAIL_USER!,
  password: process.env.EMAIL_PASSWORD!,
  service: process.env.EMAIL_SERVICE!,
}));
