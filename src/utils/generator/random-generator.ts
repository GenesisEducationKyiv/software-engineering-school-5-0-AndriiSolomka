import { randomBytes } from 'crypto';

export const randomByteGenerator = (): string => {
  return randomBytes(32).toString('hex');
};
