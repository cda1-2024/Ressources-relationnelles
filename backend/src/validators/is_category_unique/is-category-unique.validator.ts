import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { CategoryService } from 'src/services/category/category.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsCategoryUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly categoryService: CategoryService) {}

  async validate(name: string): Promise<boolean> {
    const category = await this.categoryService.findCategoryByName(name);
    return !category;
  }

  defaultMessage(args: ValidationArguments) {
    return `Le nom de la catégorie "${args.value}" est déjà utilisé.`;
  }
}
