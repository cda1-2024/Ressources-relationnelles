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

  static toResponseListDto(categories: Category[]): ListCategoryResponseDto {
    return {
      categories: categories.map((category) => this.toResponseDto(category)),
    };
  }

  static toResponseFullDto(category: Category): FullCategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      iconPath: category.iconPath,
      color: category.color,
      deleted: category.deleted,
      createdAt: category.createdAt,
      lastAutor: {
        id: category.lastAutor.id,
        username: category.lastAutor.username,
      },
    };
  }
}
