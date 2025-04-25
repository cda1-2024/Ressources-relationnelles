import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateAccountDto } from 'src/dto/user/update-account.dto';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';
import { AuthService } from 'src/services/auth.service';
import find from './../../node_modules/obliterator/find.d';
import { UserService } from './../services/user.service';

@ApiTags('Users')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //Récupérer la liste utilisateurs
  @Get('/')
  @ApiOperation({
    summary: "Récupérer la liste d'utilisateurs",
    description:
      "Récupérer la liste d'utilisateurs en fonction des critères fournis",
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
  GetUsers(): Record<string, any> {
    return this.userService.findAll();
  }

  //Récupérer un utilisateur
  @Get('/:id')
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
  getUserById(id: number): any {
    return this.userService.findById(id);
  }

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


  @Put('/myAccount')
  @ApiOperation({
    summary: 'Modifier son compte',
    description: 'Modifier son compte, email, surnom, photo de profil, etc.',
  })
  @ApiBody({
    type: UpdateAccountDto,
    description: 'Structure du JSON pour mettre son compte',
  })
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
