import { Module } from '@nestjs/common';
import { MailService } from './mail/mail.service';
import { ViewService } from './views/view.service';

@Module({
  providers: [MailService, ViewService],
  exports: [MailService, ViewService],
})
export class SharedModule {}
