import { NestFactory } from '@nestjs/core';
import { setupApp } from 'libs/common/setup/setup';
import { ensureLogDirExists } from 'libs/utils/logger/logger.config';

import { GatewayModule } from './gateway.module';
import { AppConfig } from '../config/app.config';

ensureLogDirExists();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(GatewayModule);
  setupApp(app);

  await app.listen(app.get(AppConfig).port, () => {
    console.log(`Gateway app is running on port ${app.get(AppConfig).port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Error Gateway app initialization:', error);
  process.exit(1);
});
