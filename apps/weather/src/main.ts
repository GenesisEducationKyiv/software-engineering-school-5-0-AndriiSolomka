import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Error during Weather initialization:', error);
  process.exit(1);
});
