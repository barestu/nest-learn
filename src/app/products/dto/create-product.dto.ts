import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ default: 'Product Test' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, default: 'Lorem ipsum dolor sit amet' })
  @IsOptional()
  description: string;

  @ApiProperty({ type: Number, default: 5000 })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  imageIds?: number[];
}
