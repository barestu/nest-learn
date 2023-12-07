import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  create(payload: CreateRoleDto) {
    const role = new Role();
    role.name = payload.name;
    role.acl = payload.acl;
    return this.rolesRepository.save(role);
  }

  findAll() {
    return this.rolesRepository.find();
  }

  findOne(id: number) {
    return this.rolesRepository.findOneBy({ id });
  }

  findOneWhere(where: FindOptionsWhere<Role> | FindOptionsWhere<Role>[]) {
    return this.rolesRepository.findOneBy(where);
  }

  async update(id: number, payload: UpdateRoleDto) {
    const role = await this.findOne(id);
    if (!role) {
      throw new BadRequestException('Role not found');
    }
    return this.rolesRepository.update(id, payload);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    if (!role) {
      throw new BadRequestException('Role not found');
    }
    return this.rolesRepository.remove(role);
  }
}
