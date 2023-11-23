import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false,
    });
  }

  async sendMail(payload: SendMailDto) {
    await this.transporter.sendMail({
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
    return;
  }
}
