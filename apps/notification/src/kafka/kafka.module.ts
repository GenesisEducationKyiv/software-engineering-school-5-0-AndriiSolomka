import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaConfig } from 'apps/notification/config/kafka.config';

export const KAFKA_PUBLISHER = Symbol('KAFKA_PUBLISHER');

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KAFKA_PUBLISHER,
        useFactory: (config: KafkaConfig) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: config.clientId,
              brokers: [`${config.host}:${config.port}`],
            },
          },
        }),

        inject: [KafkaConfig],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaPublisherModule {}
