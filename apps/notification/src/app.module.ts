import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { NotificationModule } from './infrastructure/notification.module';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({}),
    HttpClientModule,
    NotificationModule,
  ],
})
export class AppModule {}
