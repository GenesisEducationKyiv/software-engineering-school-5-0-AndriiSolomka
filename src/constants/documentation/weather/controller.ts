import { SwaggerDocs } from 'src/constants/types/swagger/swagger.interface';

export const WEATHER_DOCS: Record<string, SwaggerDocs> = {
  getWeather: {
    summary: 'Get current weather for a city',
    description:
      'Returns the current weather forecast for the specified city using WeatherAPI.com.',
    operationId: 'getWeather',
    parameters: [
      {
        name: 'city',
        in: 'query',
        description: 'City name for weather forecast',
        required: true,
        type: 'string',
      },
    ],
    responses: {
      200: {
        description: 'Successful operation - current weather forecast returned',
        schema: {
          type: 'object',
          properties: {
            temperature: {
              type: 'number',
              description: 'Current temperature',
            },
            humidity: {
              type: 'number',
              description: 'Current humidity percentage',
            },
            description: {
              type: 'string',
              description: 'Weather description',
            },
          },
        },
      },
      400: { description: 'Invalid request' },
      404: { description: 'City not found' },
    },
  },
};
