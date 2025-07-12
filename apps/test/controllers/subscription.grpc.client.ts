import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { join } from 'path';

interface SubscriptionService {
  Subscribe(data: {
    email: string;
    city: string;
    frequency: string;
  }): Observable<{ success: boolean; message: string }>;
  Confirm(data: {
    token: string;
  }): Observable<{ success: boolean; message: string }>;
  Unsubscribe(data: {
    token: string;
  }): Observable<{ success: boolean; message: string }>;
}
console.log(__dirname);

@Injectable()
export class SubscriptionGrpcClient implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'subscription',
      protoPath: join(process.cwd(), 'libs/proto/subscription.proto'), // ✅
      url: 'subscription:5052',
    },
  })
  private readonly client: ClientGrpc;

  private subscriptionService: SubscriptionService;

  onModuleInit() {
    this.subscriptionService = this.client.getService<SubscriptionService>(
      'SubscriptionService',
    );
  }

  getService(): SubscriptionService {
    return this.subscriptionService;
  }
}
