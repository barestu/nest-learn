import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ required: true, default: 'bob@email.com' })
  @IsNotEmpty()
  email: string;
}
