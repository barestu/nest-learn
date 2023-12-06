import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PushService } from './push/push.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, PushService],
})
export class NotificationsModule {}
