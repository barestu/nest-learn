import { ApiProperty } from '@nestjs/swagger';
import { Acl } from '../enums/acl.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class AclDto {
  @ApiProperty({ default: [] })
  @IsEnum(Acl, { each: true })
  @IsOptional()
  categories: Acl[];

  @ApiProperty({ default: [] })
  @IsEnum(Acl, { each: true })
  @IsOptional()
  orders: Acl[];

  @ApiProperty({ default: [] })
  @IsEnum(Acl, { each: true })
  @IsOptional()
  payments: Acl[];

  @ApiProperty({ default: [] })
  @IsEnum(Acl, { each: true })
  @IsOptional()
  products: Acl[];

  @ApiProperty({ default: [] })
  @IsEnum(Acl, { each: true })
  @IsOptional()
  roles: Acl[];

  @ApiProperty({ default: [] })
  @IsEnum(Acl, { each: true })
  @IsOptional()
  media: Acl[];
}
