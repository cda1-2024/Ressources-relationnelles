import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { loginUserServiceDto } from 'src/dto/user/login-service-user.dto';
import { RegisterUserDto } from 'src/dto/user/register-user.dto';
import { LoginUserDto } from './../dto/user/login-user.dto';

@ApiTags('Authentification')
@Controller('api/auth')
export class AuthController {
  // Register
  @Post('/register')
  @ApiOperation({
    summary: 'Créer un utilisateur',
    description:
      'Créer un utilisateur avec un email, un surnom et un mot de passe / ou un service de connexion',
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
        token:
          'Jwtjkesgenvkgzeqegr065ev1f5ezge6g5156G4ZH1Z5364HAG0235H4ZH02H3S4H203DB4DF3B0F2',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "La création de l'utilisateur a échoué",
    schema: {
      example: {
        status: 'error',
        message: "L'email est déjà utilisé ou les données sont invalides",
      },
    },
  })
  RegisterUser(@Body() registerUserDto: RegisterUserDto): null {
    return null;
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
  @ApiResponse({
    status: 201,
    description: "L'utilisateur a été connecté avec succés",
    schema: {
      example: {
        token:
          'Jwtjkesgenvkgzeqegr065ev1f5ezge6g5156G4ZH1Z5364HAG0235H4ZH02H3S4H203DB4DF3B0F2',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "La connection de l'utilisateur a échoué",
    schema: {
      example: {
        status: 'error',
        message: 'Le mot de passe ou identifiant sont incorrect',
      },
    },
  })
  login(@Body() loginUserDto: LoginUserDto): null {
    return null;
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
  @ApiResponse({
    status: 201,
    description: "L'utilisateur a été connecté avec succés",
    schema: {
      example: {
        token:
          'Jwtjkesgenvkgzeqegr065ev1f5ezge6g5156G4ZH1Z5364HAG0235H4ZH02H3S4H203DB4DF3B0F2',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "La connection de l'utilisateur a échoué",
    schema: {
      example: {
        status: 'error',
        message: 'Token invalide',
      },
    },
  })
  authByService(@Body() loginUserServiceDto: loginUserServiceDto): null {
    return null;
  }
}
