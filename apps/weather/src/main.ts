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
      package: 'weather',
      protoPath: 'libs/proto/weather.proto',
      url: `0.0.0.0:${config.port}`,
    },
  });

  await app.startAllMicroservices();
  await app.listen(config.httpPort);
  console.log(`Weather app is running on port ${config.httpPort}`);
}

bootstrap().catch((error) => {
  console.error('Error Weather app initialization:', error);
  process.exit(1);
});
