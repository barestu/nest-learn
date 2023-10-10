import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ default: 'Product Test' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, default: 'Lorem ipsum dolor sit amet' })
  description: string;

  @ApiProperty({ default: 5000 })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ required: false, type: ['string'], format: 'binary' })
  @IsOptional()
  images: Express.Multer.File[];
}
