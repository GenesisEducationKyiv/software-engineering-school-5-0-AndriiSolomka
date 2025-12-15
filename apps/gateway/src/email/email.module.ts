import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailConfig } from 'apps/gateway/config/email.config';

import { EMAIL_PACKAGE } from './core/email.interface';
import { EmailClientService } from './infrastructure/email.grcp.client';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: EMAIL_PACKAGE,
        useFactory: (config: EmailConfig) => ({
          transport: Transport.GRPC,
          options: {
            url: `${config.emailHost}:${config.emailPort}`,
            package: 'email',
            protoPath: 'libs/proto/email.proto',
          },
        }),
        inject: [EmailConfig],
      },
    ]),
  ],
  providers: [EmailClientService],
  exports: [EmailClientService],
})
export class EmailClientModule {}
