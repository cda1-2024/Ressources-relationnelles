import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateAccountDto } from 'src/dto/user/request/update-account.dto';
import { UpdateUserDto } from 'src/dto/user/request/update-user.dto';
import { UserService } from '../services/user/user.service';
import { User } from 'src/models/user.model';
import { ListUserRequestDto } from 'src/dto/user/request/list-user-request.dto';
import { ListUserResponseDto } from 'src/dto/user/reponse/list-user-response.dto';
import { FullUserResponseDto } from 'src/dto/user/reponse/full-user-response.dto';

@ApiTags('Users')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiOperation({
    summary: "Récupérer la liste d'utilisateurs",
    description:
      "Récupérer la liste d'utilisateurs en fonction des critères fournis",
  })
  @ApiExtraModels(ListUserRequestDto)
  @ApiOkResponse({
    description: 'La liste des utilisateurs',
    type: ListUserResponseDto,
  })
  @ApiNotFoundResponse({
    description: "L'utilisateur n'a pas été trouvé",
  })
  async GetUsers(@Query() params): Promise<ListUserResponseDto> {
    const { pageNumber = 1, pageSize = 10, ...filters } = params;
    return await this.userService.findUsersWithFilters(
      pageNumber,
      pageSize,
      filters,
    );
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Récupérer un utilisateur',
    description: 'Récupérer un utilisateur par son mail, UUID, username',
  })
  @ApiOkResponse({
    description: 'Les informations de l’utilisateur',
    type: FullUserResponseDto,
  })
  @ApiNotFoundResponse({
    description: "L'utilisateur n'a pas été trouvé",
  })
  async getUserById(@Param() params): Promise<FullUserResponseDto> {
    const id: string = params.id;
    return await this.userService.findUserById(id);
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
