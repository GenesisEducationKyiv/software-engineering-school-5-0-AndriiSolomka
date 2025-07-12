import { NestFactory } from '@nestjs/core';
import { setupApp } from 'libs/common/setup/setup';
import { ensureLogDirExists } from 'libs/utils/logger/logger.config';

import { AppConfig } from './config/app.config';
import { InternalNotificationModule } from './notification.module';

ensureLogDirExists();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(InternalNotificationModule);
  setupApp(app);

  await app.listen(app.get(AppConfig).port, () => {
    console.log(
      `Notification app is running on port ${app.get(AppConfig).port}`,
    );
  });
}

bootstrap().catch((error) => {
  console.error('Error Notification app initialization:', error);
  process.exit(1);
});
