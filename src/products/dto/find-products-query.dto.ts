import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/find-all.dto';

export class FindProductsQueryDto extends FindAllDto {
  @ApiProperty({ required: false })
  @IsOptional()
  categoryId: number;
}
