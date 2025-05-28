import { registerDecorator, ValidationOptions } from 'class-validator';
import { MatchConstraint } from './is-match.validator';

export function IsStringMatch(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}
