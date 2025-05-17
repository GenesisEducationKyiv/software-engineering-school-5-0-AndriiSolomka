import { ApiPropertyOptions } from '@nestjs/swagger';

export const WEATHER_QUERY_DTO_DOCS: Record<string, ApiPropertyOptions> = {
  city: {
    description: 'City name for weather forecast',
    example: 'London',
    required: true,
    type: 'string',
  },
};
