import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ContentType } from 'src/core/enums/content-type.enum';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiConsumes(ContentType.JSON)
  @Post()
  create(@Body() payload: CreateRoleDto) {
    return this.rolesService.create(payload);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':roleId')
  findOne(@Param('roleId') roleId: number) {
    return this.rolesService.findOne(roleId);
  }

  @Patch(':roleId')
  update(@Param('roleId') roleId: number, @Body() payload: UpdateRoleDto) {
    return this.rolesService.update(roleId, payload);
  }

  @Delete(':roleId')
  remove(@Param('roleId') roleId: number) {
    return this.rolesService.remove(roleId);
  }
}
