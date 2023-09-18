import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

  async forgotPassword() {
    return;
  }

  async resetPassword() {
    return;
  }
}
