import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ default: 'bob@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: '12345' })
  @IsNotEmpty()
  password: string;
}
