import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from '../dto/user/request/register-user.dto';
import { jwtPayload } from 'src/configuration/jwt.strategy';
import { Request, Response } from 'express';
import { BusinessException } from 'src/helper/exceptions/business.exception';
import { getErrorStatusCode } from 'src/helper/exception-utils';
import { LoginUserDto } from 'src/dto/user/request/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginUserDto, res: Response): Promise<void> {
    try {
      const user = await this.userService.findUserByIdentifier(loginDto.identifier);
      const isValid = await bcrypt.compare(loginDto.password, user?.password ?? '');

      if (!user || !isValid) {
        throw new UnauthorizedException('Identifiants invalides');
      }

      const payload: jwtPayload = {
        id: user.id,
        username: user.username,
        role: user.role,
      };
      payload.rememberMe = loginDto.rememberMe;

      await this.createTokens(res, payload);
      res.send({ message: 'Connexion réussie' });
    } catch (error) {
      throw new BusinessException('La connexion a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async register(res: Response, UserNew: RegisterUserDto): Promise<void> {
    try {
      const UserDB = await this.userService.createUserForRegister(UserNew);

      const payload = {
        id: UserDB.id,
        username: UserDB.username,
        role: UserDB.role,
      };

      await this.createTokens(res, payload);
      res.send({ message: 'Création du compte réussi' });
    } catch (error) {
      throw new BusinessException("La création de l'utilisateur a échoué", getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async refreshTokens(req: Request, res: Response): Promise<void> {
    try {
      const cookies = req.cookies as Record<string, string>;
      const refreshToken = cookies?.['refresh_token'];
      if (!refreshToken) throw new UnauthorizedException('Refresh token invalide');

      const decoded = await this.jwtService.verifyAsync<jwtPayload>(refreshToken, {
        secret: process.env.JWT_KEY,
      });

      const user = await this.userService.findUserById(decoded.id);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Refresh token invalide');
      }

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isValid) {
        throw new UnauthorizedException('Refresh token invalide');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { exp, iat, ...payload } = decoded;

      await this.createTokens(res, payload);
      res.send({ message: 'Tokens renouvelés' });
    } catch (error) {
      throw new BusinessException('Le rafraîchissement des tokens a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async createTokens(res: Response, payload: jwtPayload): Promise<void> {
    try {
      let defaultExpiresIn: string = '7d';
      if (payload.rememberMe === true) {
        defaultExpiresIn = '30d';
      }
      const newAccessToken = await this.jwtService.signAsync(payload, { expiresIn: '1h' });
      const newRefreshToken = await this.jwtService.signAsync(payload, { expiresIn: defaultExpiresIn });

      await this.userService.updateRefreshToken(payload.id, newRefreshToken);

      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000,
      });

      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    } catch (error) {
      throw new BusinessException('La création des tokens a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async logout(res: Response, userId: string): Promise<void> {
    try {
      await this.userService.deleteRefreshToken(userId);
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      res.send({ message: 'Déconnexion réussie' });
    } catch (error) {
      throw new BusinessException('La déconnexion a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }
}
