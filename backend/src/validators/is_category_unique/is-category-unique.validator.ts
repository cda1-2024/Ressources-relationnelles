import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryService } from 'src/services/category/category.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsCategoryUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly categoryService: CategoryService) {}

  async validate(name: string): Promise<boolean> {
    try {
      await this.categoryService.findCategoryByName(name);
      return false;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return true;
      }
      throw error;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Le nom de la catégorie "${args.value}" est déjà utilisé.`;
  }
}
