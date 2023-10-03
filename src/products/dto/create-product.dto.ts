import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ default: 'Product Test' })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ default: 'Lorem ipsum dolor sit amet' })
  description: string;

  @ApiProperty({ default: 5000 })
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({ type: ['string'], format: 'binary' })
  @IsOptional()
  images: Express.Multer.File[];
}
