import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/shared/mail/mail.service';
import { ViewService } from 'src/shared/view/view.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly viewService: ViewService,
  ) {}

  async login(payload: LoginDto) {
    const user = await this.usersService.validateUser(
      payload.email,
      payload.password,
    );

    if (!user) {
      throw new UnauthorizedException('Wrong email/password');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return { accessToken };
  }

  async register(payload: RegisterDto) {
    const user = await this.usersService.create(payload);
    if (!user) {
      throw new BadRequestException();
    }
    delete user.password;
    return user;
  }

  async me(userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async logout() {
    return;
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const resetToken = await this.usersService.createResetPasswordToken(email);
    const resetPasswordUrl = `http://localhost:3000/auth/reset-password?resetToken=${resetToken}`;

    const html = this.viewService.render('./forgot-password', {
      email,
      actionUrl: resetPasswordUrl,
    });

    await this.mailService.sendMail({
      from: 'noreply@example.com',
      to: email,
      subject: 'Forgot Password',
      html,
    });

    return;
  }

  async resetPassword() {
    return;
  }
}
