import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { UserService } from 'src/services/user/user.service';
import { User } from 'src/models/user.model';

dotenv.config();

export type jwtPayload = {
  id: string;
  username: string;
  role: string;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY || 'defaultSecretKey',
    });
  }

  async validate(payload: jwtPayload): Promise<User> {
    const user: User = await this.userService.findObjectUserById(payload.id);
    return user;
  }
}
