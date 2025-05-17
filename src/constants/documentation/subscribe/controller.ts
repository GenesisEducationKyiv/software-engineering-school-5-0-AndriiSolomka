import { SwaggerDocs } from 'src/constants/types/swagger/swagger.interface';

export const SUBSCRIBE_DOCS: Record<string, SwaggerDocs> = {
  subscribe: {
    summary: 'Subscribe to weather updates',
    description:
      'Subscribe an email to receive weather updates for a specific city with chosen frequency.',
    operationId: 'subscribe',
    parameters: [
      {
        name: 'email',
        in: 'formData',
        description: 'Email address to subscribe',
        required: true,
        type: 'string',
      },
      {
        name: 'city',
        in: 'formData',
        description: 'City for weather updates',
        required: true,
        type: 'string',
      },
      {
        name: 'frequency',
        in: 'formData',
        description: 'Frequency of updates (hourly or daily)',
        required: true,
        type: 'string',
        enum: ['hourly', 'daily'],
      },
    ],
    responses: {
      200: { description: 'Subscription successful. Confirmation email sent.' },
      400: { description: 'Invalid input' },
      409: { description: 'Email already subscribed' },
    },
  },
  confirm: {
    summary: 'Confirm email subscription',
    description:
      'Confirms a subscription using the token sent in the confirmation email.',
    operationId: 'confirmSubscription',
    parameters: [
      {
        name: 'token',
        in: 'path',
        description: 'Confirmation token',
        required: true,
        type: 'string',
      },
    ],
    responses: {
      200: { description: 'Subscription confirmed successfully' },
      400: { description: 'Invalid token' },
      404: { description: 'Token not found' },
    },
  },
  unsubscribe: {
    summary: 'Unsubscribe from weather updates',
    description:
      'Unsubscribes an email from weather updates using the token sent in emails.',
    operationId: 'unsubscribe',
    parameters: [
      {
        name: 'token',
        in: 'path',
        description: 'Unsubscribe token',
        required: true,
        type: 'string',
      },
    ],
    responses: {
      200: { description: 'Unsubscribed successfully' },
      400: { description: 'Invalid token' },
      404: { description: 'Token not found' },
    },
  },
};
