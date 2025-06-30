import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  iconPath: string;
  @ApiProperty()
  color: string;
}

export class ListCategoryResponseDto {
  @ApiProperty({ type: [CategoryResponseDto] })
  categories: CategoryResponseDto[];

  @ApiProperty()
  pageNumber: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalNumberEvents: number;

  @ApiProperty()
  totalPages: number;
}
