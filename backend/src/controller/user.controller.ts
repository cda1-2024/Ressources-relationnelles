import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { profile } from 'console';
import { CreateUserDto } from 'src/dto/user/cerate-user.dto';
import { UpdateAccountDto } from 'src/dto/user/update-account.dto';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  //Créer un utilisateur

  @Post('/')
  @ApiOperation({
    summary: 'Créer un utilisateur',
    description:
      'Créer un utilisateur avec un email, un surnom et un mot de passe / ou un service de connexion',
  })
  @ApiBody({
    type: CreateUserDto,
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
        message: "L'email est déjà utilisé",
      },
    },
  })
  async create(@Body() createUserDto: CreateUserDto) {}

  //Récupérer la liste utilisateurs
  @Get('/')
  @ApiOperation({
    summary: "Récupérer la liste d'utilisateurs | Admin",
    description:
      "Récupérer la liste d'utilisateurs en fonction des critères fournis, cette route peut être utilisé que par un administrateur",
  })
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiQuery({ name: 'uuid', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'banned', required: false, type: Boolean })
  @ApiQuery({ name: 'disabled', required: false, type: Boolean })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "L'utilisateur a été trouvé avec succès",
    schema: {
      example: {
        data: [
          {
            id: 123,
            email: 'example1@gmail.com',
            username: 'User1',
          },
          {
            id: 124,
            email: 'example2@gmail.com',
            username: 'User2',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "La Recherche de l'utilisateur a échoué",
    schema: {
      example: {
        status: 'error',
        message: 'Échec de la demande',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "L'utilisateur n'a pas été trouvé",
    schema: {
      example: {
        status: 'error',
        message: "L'utilisateur/(s) n'a pas été trouvé",
      },
    },
  })
  findUser(): null {
    return null;
  }

  //Récupérer un utilisateur
  @Get('/identifier')
  @ApiOperation({
    summary: 'Récupérer un utilisateur',
    description: 'Récupérer un utilisateur par son mail, UUID, username',
  })
  @ApiQuery({ name: 'uuid', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'username', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "L'utilisateur a été trouvé avec succès",
    schema: {
      example: {
        id: 123,
        uuid: 'UU_15efz',
        email: 'example1@gmail.com',
        username: 'User1',
        bio: 'I am a user',
        pictre_profile: 'http://image1-1',
        banned: false,
        disabled: false,
        createdAt: '2025-03-14T10:00:00Z',
        updatedAt: '2025-03-14T10:00:00Z',
        role: 'user',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "La Recherche de l'utilisateur a échoué",
    schema: {
      example: {
        status: 'error',
        message: 'Échec de la demande',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "L'utilisateur n'a pas été trouvé",
    schema: {
      example: {
        status: 'error',
        message: "L'utilisateur/(s) n'a pas été trouvé",
      },
    },
  })
  findUserClassic(): null {
    return null;
  }

  // Mettre à jour un utilisateur - use by admin
  @Put('/:id')
  @ApiOperation({
    summary: 'Modifier un utilisateur | Admin',
    description:
      "Modifier un utilisateur en fonction de l'identifiant ou de l'UUID fourni",
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Structure du JSON pour mettre à jour un utilisateur',
  })
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "L'utilisateur a été mis à jour avec succès",
    schema: {
      example: {
        data: {
          id: 123,
          email: 'example1@gmail.com',
          username: 'User1',
          banned: false,
          disabled: false,
          createdAt: '2025-03-14T10:00:00Z',
          updatedAt: '2025-03-14T10:00:00Z',
          role: 'user',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "La mise à jour de l'utilisateur a échoué",
    schema: {
      example: {
        status: 'error',
        message: "La mise à jour de l'utilisateur a échoué",
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "L'utilisateur n'a pas été trouvé",
    schema: {
      example: {
        status: 'error',
        message: "L'utilisateur n'a pas été trouvé",
      },
    },
  })
  updateUser(): null {
    return null;
  }

  // Se connecter un utilisateur
  @Post('/login')
  @ApiOperation({
    summary: 'Se connecter un utilisateur',
    description:
      'Se connecter un utilisateur avec un email ou un UUID et un type de service',
  })
  @ApiBody({
    schema: {
      example: {
        email: 'example@gmail.com',
        password: 'Compelx48916#.',
        uuid: 'UU_15efz',
        type_service: 'Google',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "L'utilisateur s'est connecté avec succès",
    schema: {
      example: {
        token:
          'Jwtjkesgenvkgzeqegr065ev1f5ezge6g5156G4ZH1Z5364HAG0235H4ZH02H3S4H203DB4DF3B0F2',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "La connexion de l'utilisateur a échoué",
    schema: {
      example: {
        status: 'error',
        message: "L'email ou le mot de passe est incorrect",
      },
    },
  })
  async login(@Body() loginDto: {}) {}

  @Put('/myAccount')
  @ApiOperation({
    summary: 'Modifier son compte',
    description: 'Modifier son compte, email, surnom, photo de profil, etc.',
  })
  @ApiBody({
    type: UpdateAccountDto,
    description: 'Structure du JSON pour mettre son compte',
  })
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Compte mis à jour avec succès',
    schema: {
      example: {
        data: {
          id: 123,
          email: 'b.976@gmail.com',
          username: 'Vnono',
          bio: 'I am user',
          profile_picture: 'http://image1-1',
          updatedAt: '2025-03-14T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'La mise à jour du compte a échoué',
    schema: {
      example: {
        status: 'error',
        message: 'La mise à jour du compte a échoué',
      },
    },
  })
  updateMyAccount(): null {
    return null;
  }
}
