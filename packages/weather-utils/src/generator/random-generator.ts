import { randomBytes } from 'crypto';

/**
 * Generates a random hexadecimal string using cryptographically secure random bytes
 * @param length - The number of bytes to generate (default: 32)
 * @returns A hexadecimal string representation of the random bytes
 */
export function generateRandomHex(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Generates a random token string
 * @returns A 64-character hexadecimal token
 */
export function generateToken(): string {
  return generateRandomHex(32);
}
