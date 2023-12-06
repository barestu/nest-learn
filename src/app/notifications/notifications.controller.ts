import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PushService } from './push/push.service';
import { SendPushNotifDto } from './dto/send-push-notif.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly pushService: PushService,
  ) {}

  @Post('test-push')
  testPush(@Body() payload: SendPushNotifDto) {
    this.pushService.send(payload);
  }
}
