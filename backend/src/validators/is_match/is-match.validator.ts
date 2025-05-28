import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'IsStringMatch' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints as [string];
    const relatedValue = (args.object as { [key: string]: unknown })[relatedPropertyName];
    return value === relatedValue;
  }
  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints as [string];
    return `${args.property} n'est pas égal à ${relatedPropertyName}`;
  }
}
