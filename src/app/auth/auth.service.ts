import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { UsersService } from 'src/app/users/users.service';
import { MailService } from 'src/app/shared/mail/mail.service';
import { ViewService } from 'src/app/shared/views/view.service';

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

    const accessToken = await this.usersService.createAccessToken(
      user.id,
      user.email,
    );

    return { accessToken };
  }

  async register(payload: RegisterDto) {
    const user = await this.usersService.create(payload);
    if (!user) {
      throw new BadRequestException();
    }
    delete user.password;
    const accessToken = await this.usersService.createAccessToken(
      user.id,
      user.email,
    );
    await this.sendAccountActivationEmail(user.email, accessToken);
    return user;
  }

  async activateAccount({ token }: ActivateAccountDto) {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      await this.usersService.update(decoded.id, { isActive: true });
      await this.sendWelcomeUserEmail(decoded.email);
      return;
    } catch (error) {
      throw new BadRequestException();
    }
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

  async resetPassword({
    resetToken,
    oldPassword,
    newPassword,
  }: ResetPasswordDto) {
    try {
      const decoded = await this.jwtService.verifyAsync(resetToken);
      const user = await this.usersService.validateUser(
        decoded.email,
        oldPassword,
      );
      return this.usersService.update(user.id, { password: newPassword });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async sendAccountActivationEmail(email: string, accessToken: string) {
    const activationUrl = `http://localhost:3000/auth/activate-account?accessToken=${accessToken}`;
    const html = await this.viewService.render('verify-account', {
      email,
      actionUrl: activationUrl,
    });
    return this.mailService.sendMail({
      from: 'noreply@example.com',
      to: email,
      subject: 'Verify Your Account',
      html,
    });
  }

  async sendWelcomeUserEmail(email: string) {
    const html = await this.viewService.render('welcome-user', {
      email,
      actionUrl: '',
    });
    return this.mailService.sendMail({
      from: 'noreply@example.com',
      to: email,
      subject: 'Congratulation! Your Account is now Active!',
      html,
    });
  }

  async sendForgotPasswordEmail({ email }: ForgotPasswordDto) {
    const resetToken = await this.usersService.createResetPasswordToken(email);
    const resetPasswordUrl = `http://localhost:3000/auth/reset-password?resetToken=${resetToken}`;
    const html = await this.viewService.render('forgot-password', {
      email,
      actionUrl: resetPasswordUrl,
    });
    return this.mailService.sendMail({
      from: 'noreply@example.com',
      to: email,
      subject: 'Forgot Password Notice',
      html,
    });
  }
}
