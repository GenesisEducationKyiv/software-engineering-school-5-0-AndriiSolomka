import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ensureLogDirExists } from 'libs/utils/logger/logger.config';

import { AppModule } from './app.module';
import { AppConfig } from '../config/app.config';

async function bootstrap(): Promise<void> {
  ensureLogDirExists();

  const appContext = await NestFactory.createApplicationContext(AppModule);
  const config = appContext.get(AppConfig);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'notification',
        protoPath: 'libs/proto/notification.proto',
        url: `0.0.0.0:${config.port}`,
      },
    },
  );

  await app.listen();
  console.log(`Notification gRPC service is running on port ${config.port}`);
}

bootstrap().catch((error) => {
  console.error('Error Notification app initialization:', error);
  process.exit(1);
});
