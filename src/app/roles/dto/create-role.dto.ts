import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AclDto } from './acl.dto';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @Type(() => AclDto)
  @ValidateNested()
  @IsOptional()
  acl?: AclDto;
}
