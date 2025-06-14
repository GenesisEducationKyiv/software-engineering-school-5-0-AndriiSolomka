import { Subscription, Frequency } from '@prisma/client';
import { CreateSubscriptionDto } from 'src/subscription-handlers/dto/create-subscription.dto';
import { SubWithTokens } from 'src/constants/types/prisma/subscription.type';

export interface ISubscriptionDomainService {
  create(dto: CreateSubscriptionDto): Promise<Subscription>;
  findUnique(email: string, city: string): Promise<Subscription | null>;
  confirm(subscription_id: number): Promise<Subscription>;
  delete(subscription_id: number): Promise<Subscription>;
  getByFrequency(frequency: Frequency): Promise<SubWithTokens[]>;
  deleteUnconfirmed(): Promise<{ count: number }>;
}
