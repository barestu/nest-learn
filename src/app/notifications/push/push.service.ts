import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { SendPushNotifDto } from '../dto/send-push-notif.dto';

@Injectable()
export class PushService {
  constructor(
    @InjectFirebaseAdmin()
    private readonly firebase: FirebaseAdmin,
  ) {}

  async send(payload: SendPushNotifDto) {
    try {
      await this.firebase.messaging.send({
        token: payload.token,
        notification: {
          title: payload.title,
          body: payload.body,
        },
      });
      return;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
