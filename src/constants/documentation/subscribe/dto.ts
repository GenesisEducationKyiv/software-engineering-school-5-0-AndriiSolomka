import { ApiPropertyOptions } from '@nestjs/swagger';

export const SUBSCRIPTION_DTO_DOCS: Record<string, ApiPropertyOptions> = {
  email: {
    description: 'Email address to subscribe',
    example: 'user@example.com',
    required: true,
  },
  city: {
    description: 'City for weather updates',
    example: 'London',
    required: true,
  },
  frequency: {
    description: 'Frequency of updates',
    enum: ['hourly', 'daily'],
    example: 'hourly',
    required: true,
  },
};
