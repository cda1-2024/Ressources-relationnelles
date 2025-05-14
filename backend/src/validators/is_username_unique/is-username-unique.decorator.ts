import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { IsUsernameUniqueConstraint } from './is-username-unique.validator';

export function IsUsernameUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsUsernameUnique',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsUsernameUniqueConstraint,
    });
  };
}
