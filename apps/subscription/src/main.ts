import { NestFactory } from '@nestjs/core';
import { setupApp } from 'common/setup/setup';
import { AppConfig } from 'libs/config/app.config';
import { ensureLogDirExists } from 'libs/utils/logger/logger.config';

import { SubscriptionManagementModule } from './subscription.module';

ensureLogDirExists();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(SubscriptionManagementModule);
  setupApp(app);

  await app.listen(app.get(AppConfig).port, () => {
    console.log(
      `Subscription app is running on port ${app.get(AppConfig).port}`,
    );
  });
}

bootstrap().catch((error) => {
  console.error('Error Subscription app initialization:', error);
  process.exit(1);
});
