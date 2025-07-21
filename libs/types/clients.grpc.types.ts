import { EmailServiceDefinition } from 'libs/proto/generated/email';
import { SubscriptionServiceDefinition } from 'libs/proto/generated/subscription';
import { WeatherServiceDefinition } from 'libs/proto/generated/weather';
import { Client } from 'nice-grpc';

export type WeatherClient = Client<typeof WeatherServiceDefinition>;
export type SubscriptionClient = Client<typeof SubscriptionServiceDefinition>;
export type EmailClient = Client<typeof EmailServiceDefinition>;
