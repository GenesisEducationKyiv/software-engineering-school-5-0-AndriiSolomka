import { NestFactory } from '@nestjs/core';
import { setupApp } from 'common/setup/setup';
import { ensureLogDirExists } from 'libs/utils/logger/logger.config';

import { InternalEmailModule } from './email.module';
import { AppConfig } from '../config/app.config';

ensureLogDirExists();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(InternalEmailModule);
  setupApp(app);

  await app.listen(app.get(AppConfig).port, () => {
    console.log(`Email app is running on port ${app.get(AppConfig).port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Error Email app initialization:', error);
  process.exit(1);
});
