import { NestFactory } from '@nestjs/core';
import { setupApp } from 'common/setup/setup';
import { ensureLogDirExists } from 'libs/utils/logger/logger.config';

import { AppModule } from './app.module';

ensureLogDirExists();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  setupApp(app);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.error('Error during app initialization:', error);
  process.exit(1);
});
