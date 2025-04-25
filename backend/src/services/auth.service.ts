import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(
    identifier: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findUserByIdentifier(identifier);
    console.log(user);
    console.log('refresh');
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    //To do add link picture to user
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
