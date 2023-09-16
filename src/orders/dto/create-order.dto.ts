import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsNumberString()
  productId: number;

  @ApiProperty()
  @IsNumberString()
  amount: number;
}
