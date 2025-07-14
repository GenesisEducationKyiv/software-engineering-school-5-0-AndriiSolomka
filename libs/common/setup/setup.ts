import { INestApplication, ValidationPipe } from '@nestjs/common';

import { GrpcExceptionFilter } from '../filters/grpc.exception.filter';

export function setupApp(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new GrpcExceptionFilter());

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
      'https://weather-api-application-tau.vercel.app',
      'http://35.207.129.35:3000',
      'http://localhost:5051',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
  });
}
