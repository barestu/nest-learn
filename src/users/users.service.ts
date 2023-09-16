import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: { password: true },
    });

    if (!user) {
      return null;
    }

    const isPasswordMatch = await this.comparePassword(password, user.password);

    if (!isPasswordMatch) {
      return null;
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    return this.usersRepository.remove(user);
  }
}
