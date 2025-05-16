import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import { CategoryService } from 'src/services/category/category.service';
import { Category } from './../../models/category.model';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsCategoryUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly categoryService: CategoryService) {}

  async validate(name: string, args: ValidationArguments): Promise<boolean> {
    const category = await this.categoryService.findCategoryByName(name);
    return !category;
  }

  defaultMessage(args: ValidationArguments) {
    return `Le nom de la catégorie "${args.value}" est déjà utilisé.`;
  }
}
