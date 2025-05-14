import { Body, Controller, Get, NotFoundException, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
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
import { UpdateMyAccountDto } from 'src/dto/user/request/update-account.dto';
import { UpdateUserDto } from 'src/dto/user/request/update-user.dto';
import { UserService } from '../services/user/user.service';
import { ListUserRequestDto } from 'src/dto/user/request/list-user-request.dto';
import { ListUserResponseDto, UserResponseDto } from 'src/dto/user/response/list-user-response.dto';
import { FullUserResponseDto } from 'src/dto/user/response/full-user-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { updateMyAccount as updateMyAccountDto } from './../dto/user/request/update-my-account';

@ApiTags('Users')
@ApiExtraModels(
  ListUserRequestDto,
  ListUserResponseDto,
  UserResponseDto,
  FullUserResponseDto,
  UpdateMyAccountDto,
  UpdateUserDto,
  updateMyAccountDto,
)
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'username', required: false, type: String })
  @ApiNotFoundResponse({
    description: 'Auncun utilisateur a été trouvé',
  })
  async GetUsers(@Query() params): Promise<ListUserResponseDto> {
    const { pageNumber = 1, pageSize = 10, ...filters } = params;
    return await this.userService.findUsersWithFilters(pageNumber, pageSize, filters);
  }

  @Get('check/identifier/:identifier')
  @ApiOperation({
    summary: 'Récupérer un utilisateur',
    description: 'Récupérer un utilisateur par son mail / username',
  })
  @ApiOkResponse({
    description: 'Les informations de l’utilisateur',
    example: { IsAvailable: true },
  })
  @ApiNotFoundResponse({
    description: "L'utilisateur n'a pas été trouvé",
  })
  async GetUserByIdentifier(@Param() params: { identifier: string }) {
    const identifier: string = params.identifier;
    const user = await this.userService.findUserByIdentifier(identifier);
    if (user != null) {
      return { IsAvailable: false };
    } else {
      return { IsAvailable: true };
    }
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Récupérer un utilisateur',
    description: 'Récupérer un utilisateur par son id',
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

  @Put('/myAccount')
  @ApiOperation({
    summary: 'Modifier son compte',
    description: 'Modifier son compte, email, surnom, photo de profil, etc.',
  })
  @ApiBody({
    type: UpdateMyAccountDto,
    description: 'Structure du JSON pour mettre son compte',
  })
  @ApiExtraModels(UpdateMyAccountDto)
  @ApiOkResponse({
    description: 'Les informations de l’utilisateur',
    type: FullUserResponseDto,
  })
  @ApiNotFoundResponse({
    description: "L'utilisateur n'a pas été trouvé",
  })
  @UseGuards(AuthGuard('jwt'))
  updateMyAccount(@Req() req, @Body() updateMyAccountDto: updateMyAccountDto) {
    const user = req.user;
    return this.userService.updateMyAccount(user.id, updateMyAccountDto);
  }

  @Put('/:id')
  @ApiOperation({
    summary: 'Modifier un utilisateur | Admin',
    description: "Modifier un utilisateur en fonction de l'identifiant ou de l'UUID fourni",
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Structure du JSON pour mettre à jour un utilisateur',
  })
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiExtraModels(UpdateUserDto)
  @ApiOkResponse({
    description: 'Les informations de l’utilisateur',
    type: FullUserResponseDto,
  })
  @ApiNotFoundResponse({
    description: "L'utilisateur n'a pas été trouvé",
  })
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.updateUser(id, updateUserDto);
  }
}
