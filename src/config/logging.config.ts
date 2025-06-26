import { registerAs } from '@nestjs/config';

export default registerAs('logging', () => ({
  enableFileLogging: process.env.ENABLE_FILE_LOGGING === 'true',
}));
