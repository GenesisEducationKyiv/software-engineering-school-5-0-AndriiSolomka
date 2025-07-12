import { NestFactory } from '@nestjs/core';
import { setupApp } from 'libs/common/setup/setup';

import { AppModule } from './app.module';
import { AppConfig } from '../config/app.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  setupApp(app);

  await app.listen(app.get(AppConfig).port, () => {
    console.log(`Notification is running on port ${app.get(AppConfig).port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Error Notification app initialization:', error);
  process.exit(1);
});
