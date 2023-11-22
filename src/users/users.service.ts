import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string) {
    const saltOrRounds = await bcrypt.genSalt();
    const result = await bcrypt.hash(password, saltOrRounds);
    return result;
  }

  async comparePassword(password: string, hash: string) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }

  async create(payload: CreateUserDto) {
    const user = new User();
    user.email = payload.email;
    user.password = await this.hashPassword(payload.password);
    return this.usersRepository.save(user);
  }

  findAll(query: FindUsersQueryDto) {
    return this.usersRepository.findAndCount({
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      order: {
        [query.orderBy]: query.order,
      },
    });
  }

  async findOne(id: number) {
    return this.usersRepository.findOneBy({ id: id || IsNull() });
  }

  async findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      return null;
    }

    const isPasswordMatch = await this.comparePassword(password, user.password);

    if (!isPasswordMatch) {
      return null;
    }

    delete user.password;

    return user;
  }

  async createResetPasswordToken(email: string) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const resetToken = await this.jwtService.signAsync(
      { email },
      { expiresIn: '1d', secret: 'eqwopiqweoip' },
    );
    user.resetPasswordToken = resetToken;
    await this.usersRepository.save(user);
    return resetToken;
  }

  async update(id: number, payload: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return this.usersRepository.update(id, payload);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    return this.usersRepository.remove(user);
  }
}
