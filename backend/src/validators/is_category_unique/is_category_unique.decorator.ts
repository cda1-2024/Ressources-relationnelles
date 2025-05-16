import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsCategoryUniqueConstraint } from './is_category_unique.validator';

export function IsCategoryUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCategoryUniqueConstraint,
    });
  };
}
