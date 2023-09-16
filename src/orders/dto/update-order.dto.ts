import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty()
  @IsOptional()
  status: string;
}
