import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfig);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'subscription',
      protoPath: 'libs/proto/subscription.proto',
      url: `0.0.0.0:${config.port}`,
    },
  });

  await app.startAllMicroservices();
  await app.listen(config.httpPort);
}

bootstrap().catch((error) => {
  console.error('Error Subscription app initialization:', error);
  process.exit(1);
});
