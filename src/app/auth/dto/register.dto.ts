import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ default: 'bob@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: '12345' })
  @IsNotEmpty()
  password: string;
}
