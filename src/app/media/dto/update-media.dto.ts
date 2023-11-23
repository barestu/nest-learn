import { ApiProperty } from '@nestjs/swagger';

export class UpdateMediaDto {
  @ApiProperty({ required: false })
  entityName: string;

  @ApiProperty({ required: false })
  entityId: number;
}
