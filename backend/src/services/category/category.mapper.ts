import { Injectable } from '@nestjs/common';
import { Category } from 'src/models/category.model';
import { FullCategoryResponseDto } from 'src/dto/category/response/full-category-response.dto';
import { CategoryResponseDto, ListCategoryResponseDto } from 'src/dto/category/response/list-category-response.dto';

@Injectable()
export class CategoryMapper {
  static toResponseDto(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      iconPath: category.iconPath,
      color: category.color,
    };
  }

  static toResponseListDto(
    categories: Category[],
    pageNumber: number,
    pageSize: number,
    totalNumberEvents: number,
  ): ListCategoryResponseDto {
    return {
      categories: categories.map((category) => this.toResponseDto(category)),
      pageNumber,
      pageSize,
      totalNumberEvents,
      totalPages: Math.ceil(totalNumberEvents / pageSize),
    };
  }

  static toResponseFullDto(category: Category): FullCategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      iconPath: category.iconPath,
      color: category.color,
      createdAt: category.createdAt,
      lastAuthor: {
        id: category.lastAuthor.id,
        username: category.lastAuthor.username,
      },
    };
  }
}
