import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ActivateAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  token: string;
}
