import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindAllDto {
  @ApiProperty({
    required: false,
    description: 'Page number',
  })
  @Transform((ctx) => parseInt(ctx.value))
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    required: false,
    description: 'Limit per page',
  })
  @Transform((ctx) => parseInt(ctx.value))
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({
    required: false,
    description: 'Sort ordering: asc, desc',
  })
  @IsOptional()
  order?: 'ASC' | 'DESC' = 'ASC';

  @ApiProperty({
    required: false,
    description: 'Sort by column name: id, createdAt, updatedAt',
  })
  @IsOptional()
  orderBy?: string = 'id';
}
