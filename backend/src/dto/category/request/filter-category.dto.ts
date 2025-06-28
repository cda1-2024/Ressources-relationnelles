import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class FilterCategoryRequestDto {
  @ApiProperty({
    example: 'La fresqu',
    description: 'Le champ de recherche',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    example: 1,
    description: 'Le numéro de la page',
  })
  @IsOptional()
  @Type(() => Number)
  readonly page: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Le nombre de catégories par page',
  })
  @IsOptional()
  @Type(() => Number)
  readonly pageSize: number = 10;
}
