import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaConfig } from 'apps/email/config/kafka.config';

export const KAFKA_CONSUMER = Symbol('KAFKA_CONSUMER');

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KAFKA_CONSUMER,
        useFactory: (config: KafkaConfig) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: config.clientId,
              brokers: [`${config.host}:${config.port}`],
            },
            consumer: {
              groupId: config.groupId,
            },
          },
        }),
        inject: [KafkaConfig],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaConsumerModule {}
