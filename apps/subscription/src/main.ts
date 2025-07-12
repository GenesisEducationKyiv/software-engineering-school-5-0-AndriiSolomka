import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const config = appContext.get(AppConfig);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'subscription',
        protoPath: 'libs/proto/subscription.proto',
        url: `0.0.0.0:${config.port}`,
      },
    },
  );

  await app.listen();
  console.log(`Subscription microservice running on gRPC port ${config.port}`);
}

bootstrap().catch((error) => {
  console.error('Error Subscription app initialization:', error);
  process.exit(1);
});
