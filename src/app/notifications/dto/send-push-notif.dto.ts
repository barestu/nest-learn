import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class SendPushNotifDto {
  @ApiProperty({ default: '' })
  @IsNotEmpty()
  token: string;

  @ApiProperty({ default: 'Test Title' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ default: 'This is the notification body' })
  @IsOptional()
  body: string;
}
