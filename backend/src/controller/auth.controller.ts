import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { loginUserServiceDto } from 'src/dto/user/request/login-service-user.dto';
import { RegisterUserDto } from 'src/dto/user/request/register-user.dto';
import { LoginUserDto } from '../dto/user/request/login-user.dto';
import { AuthService } from 'src/services/auth.service';
import { UserRole } from 'src/models/user.model';
import { ok } from 'assert';
import { access } from 'fs';

@ApiTags('Authentification')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiOperation({
    summary: 'Créer un utilisateur',
    description: 'Créer un utilisateur avec un email, un surnom et un mot de passe / ou un service de connexion',
  })
  @ApiBody({
    type: RegisterUserDto,
    description: 'Structure du json pour créer un utilisateur',
  })
  @ApiResponse({
    status: 201,
    description: "L'utilisateur a été créé avec succès",
    schema: {
      example: {
        access_token: 'Jwtjkesgenvkgzeqegr065ev1f5ezge6g5156G4ZH1Z5364HAG0235H4ZH02H3S4H203DB4DF3B0F2',
      },
    },
  })
  @ApiBadRequestResponse({
    description: "La création de l'utilisateur a échoué",
  })
  async register(@Body() registerUserDto: RegisterUserDto) {
    const result = await this.authService.register(registerUserDto);
    return result;
  }

  @Post('/login')
  @ApiOperation({
    summary: 'Se connecter',
    description: 'Se connecter',
  })
  @ApiBody({
    type: LoginUserDto,
    description: "Structure du json pour la connexion d'un utisilateur",
  })
  @ApiCreatedResponse({ description: "L'utilisateur est bien connécté" })
  @ApiBadRequestResponse({
    description: "La connection de l'utilisateur a échoué",
  })
  async login(@Body() loginDto: LoginUserDto) {
    const accessToken = await this.authService.login(loginDto.identifier, loginDto.password);
    return { accessToken };
  }

  @Post('loginByService')
  @ApiOperation({
    summary: 'Se connecter avec un service auth',
    description: 'Se connecter avec un service auth',
  })
  @ApiBody({
    type: loginUserServiceDto,
    description: "Structure du json pour la connexion d'un utisilateur",
  })
  @ApiCreatedResponse({ description: "L'utilisateur est bien connécté" })
  @ApiBadRequestResponse({
    description: "La connection de l'utilisateur a échoué",
  })
  authByService(@Body() loginUserServiceDto: loginUserServiceDto): null {
    return null;
  }
}
