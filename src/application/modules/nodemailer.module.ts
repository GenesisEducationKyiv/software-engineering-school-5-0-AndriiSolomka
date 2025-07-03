import { Module } from '@nestjs/common';
import { NodemailerService } from 'src/infrastructure/email/nodemailer.service';

@Module({
  providers: [NodemailerService],
  exports: [NodemailerService],
})
export class NodemailerModule {}
