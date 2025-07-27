import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { AppConfig } from '../config/app.config';
import { KafkaConfig } from '../config/kafka.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfig);
  const kafkaConfig = app.get(KafkaConfig);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: kafkaConfig.clientId,
        brokers: [`${kafkaConfig.host}:${kafkaConfig.port}`],
      },
      consumer: {
        groupId: kafkaConfig.groupId,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'email',
      protoPath: 'libs/proto/email.proto',
      url: `0.0.0.0:${config.port}`,
    },
  });

  await app.startAllMicroservices();

  console.log(`Email microservice is running on port ${config.port}`);
}

bootstrap().catch((error) => {
  console.error('Error Email app initialization:', error);
  process.exit(1);
});
