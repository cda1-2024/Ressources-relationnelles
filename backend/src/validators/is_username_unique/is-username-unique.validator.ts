import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { UserService } from 'src/services/user/user.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUsernameUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(username: string, args: ValidationArguments): Promise<boolean> {
    const user = await this.userService.findUserByIdentifier(username);
    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return `Le nom d'utilisateur "${args.value}" est déjà pris.`;
  }
}
