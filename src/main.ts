import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ensureLogDirExists } from 'src/utils/logger/logger.config';
import { setupApp } from './common/setup/setup';

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
