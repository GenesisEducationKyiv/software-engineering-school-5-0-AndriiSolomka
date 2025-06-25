import { CreateSubscriptionDto } from 'src/subscription-handlers/dto/create-subscription.dto';
import { Frequency, Subscription } from '@prisma/client';
import { SubWithTokens } from 'src/constants/types/prisma/subscription.type';

export interface SubscriptionRepository {
  create(dto: CreateSubscriptionDto): Promise<Subscription>;
  findOne(email: string, city: string): Promise<Subscription | null>;
  delete(subscription_id: number): Promise<Subscription>;
  confirm(subscription_id: number): Promise<Subscription>;
  findByFrequency(frequency: Frequency): Promise<SubWithTokens[]>;
  deleteUnconfirmed(): Promise<{ count: number }>;
}

export const SubscriptionRepositoryToken = Symbol('ISubscriptionRepository');
