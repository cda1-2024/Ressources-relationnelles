import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from '../dto/user/request/register-user.dto';
import { ValidationException } from 'src/helper/validationException';
import { jwtPayload } from 'src/configuration/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(identifier: string, password: string): Promise<string> {
    const user = await this.usersService.findUserByIdentifier(identifier);
    const isValid = await bcrypt.compare(password, user?.password ?? '');

    if (!user || !isValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload: jwtPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    return this.jwtService.signAsync(payload);
  }

  async register(UserNew: RegisterUserDto): Promise<{ accessToken: string }> {
    const errors: Record<string, string> = {};

    if (Object.keys(errors).length > 0) {
      throw new ValidationException(errors);
    }

    const UserDB = await this.usersService.createUser(UserNew);

    const payload = {
      id: UserDB.id,
      username: UserDB.username,
      role: UserDB.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
