import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ensureLogDirExists } from 'libs/utils/logger/logger.config';

import { AppModule } from './app.module';
import { AppConfig } from '../config/app.config';

async function bootstrap() {
  ensureLogDirExists();

  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfig);

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
