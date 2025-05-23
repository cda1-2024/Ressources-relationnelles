import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(email: string): Promise<boolean> {
    const user = await this.userService.findUserByIdentifier(email);
    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return `L'email "${args.value}" est déjà utilisé.`;
  }
}
