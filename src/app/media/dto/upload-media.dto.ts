import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UploadMediaDto {
  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  @IsOptional()
  file: Express.Multer.File;
}
