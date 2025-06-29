import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from 'src/dto/user/request/update-user.dto';
import { UserService } from '../services/user/user.service';
import { ListUserResponseDto, UserResponseDto } from 'src/dto/user/response/list-user-response.dto';
import { FullUserResponseDto } from 'src/dto/user/response/full-user-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { updateMyAccountDto as updateMyAccountDto } from '../dto/user/request/update-my-account.dto';
import { UserMapper } from 'src/services/user/user.mapper';
import { User } from 'src/models/user.model';
import { CurrentUser } from 'src/middleware/guards/current-user.decorator';
import { FilterUserRequestDto } from 'src/dto/user/request/filter-user.dto';
import { updateMyPasswordDto } from 'src/dto/user/request/update-my-password.dto';
import { CreateUserRequestDto } from 'src/dto/user/request/create-user.dto';

@ApiTags('Users')
@ApiExtraModels(
  FilterUserRequestDto,
  updateMyPasswordDto,
  ListUserResponseDto,
  UserResponseDto,
  FullUserResponseDto,
  UpdateUserDto,
  updateMyAccountDto,
)
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Créer un utilisateur',
    description: 'Créer un utilisateur avec un email, un surnom et un mot de passe / ou un service de connexion',
  })
  @ApiBody({
    type: CreateUserRequestDto,
    description: 'Structure du json pour créer un utilisateur',
  })
  @ApiOkResponse({
    description: "L'utilisateur a été créé avec succès",
  })
  @ApiBadRequestResponse({
    description: "La création de l'utilisateur a échoué",
  })
  async register(@Body() createUserDto: CreateUserRequestDto) {
    const result = await this.userService.createUser(createUserDto);
    return UserMapper.toResponseDto(result);
  }

  @Get('/')
  @ApiOperation({
    summary: 'Récupérer la liste des utilisateurs',
    description: 'Récupérer la liste des utilisateurs à l’aide de filtres',
  })
  @ApiOkResponse({
    description: 'Les informations de l’utilisateur',
    type: ListUserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Auncun utilisateur a été trouvé',
  })
  async GetUsers(@Query() filters: FilterUserRequestDto): Promise<ListUserResponseDto> {
    const { users, total } = await this.userService.findUsersWithFilters(filters);
    return UserMapper.toResponseListDto(users, filters.page, filters.pageSize, total);
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

  @Get('/me')
  @ApiOperation({
    summary: "Récupérer l'utilisateur connecté",
    description: "Récupérer l'utilisateur connecté",
  })
  @ApiOkResponse({
    description: 'Les informations de l’utilisateur',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: "L'utilisateur n'a pas été trouvé",
  })
  @UseGuards(AuthGuard('jwt'))
  getMe(@CurrentUser() user: User): Promise<UserResponseDto> {
    return Promise.resolve(UserMapper.toResponseDto(user));
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
  async getUserById(@Param('id') id: string): Promise<FullUserResponseDto> {
    const user: User = await this.userService.findUserById(id);
    return UserMapper.toResponseFullDto(user);
  }

  @Put('/myAccount')
  @ApiOperation({
    summary: 'Modifier son compte',
    description: 'Modifier son compte, email, surnom, photo de profil, etc.',
  })
  @ApiBody({
    type: updateMyAccountDto,
    description: 'Structure du JSON pour mettre à jour son compte',
  })
  @ApiExtraModels(updateMyAccountDto)
  @ApiOkResponse({
    description: 'Les informations de l’utilisateur',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: "L'utilisateur n'a pas été trouvé",
  })
  @UseGuards(AuthGuard('jwt'))
  async updateMyAccount(
    @CurrentUser() user: User,
    @Body() updateMyAccountDto: updateMyAccountDto,
  ): Promise<UserResponseDto> {
    const userResponse = await this.userService.updateMyAccount(user.id, updateMyAccountDto);
    return UserMapper.toResponseDto(userResponse);
  }

  @Put('/myPassword')
  @ApiOperation({
    summary: 'Modifier son mot de passe',
    description: 'Modifier son mot de passe',
  })
  @ApiBody({
    type: updateMyPasswordDto,
    description: 'Structure du JSON pour mettre à jour son mot de passe',
  })
  @ApiExtraModels(updateMyPasswordDto)
  @ApiOkResponse({
    description: 'Les informations de l’utilisateur',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: "L'utilisateur n'a pas été trouvé",
  })
  @UseGuards(AuthGuard('jwt'))
  async updateMyPassword(
    @CurrentUser() user: User,
    @Body() updateMyPasswordDto: updateMyPasswordDto,
  ): Promise<UserResponseDto> {
    const userResponse = await this.userService.updateMyPassword(user.id, updateMyPasswordDto);
    return UserMapper.toResponseDto(userResponse);
  }

  @Put('/:id')
  @ApiOperation({
    summary: 'Modifier un utilisateur | administrateur',
    description: "Modifier un utilisateur en fonction de l'identifiant ou de l'UUID fourni",
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Structure du JSON pour mettre à jour un utilisateur',
  })
  @ApiQuery({ name: 'id', required: false, type: String })
  @ApiExtraModels(UpdateUserDto)
  @ApiOkResponse({
    description: 'Les informations de l’utilisateur',
    type: FullUserResponseDto,
  })
  @ApiNotFoundResponse({
    description: "L'utilisateur n'a pas été trouvé",
  })
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.updateUser(id, updateUserDto);
    return UserMapper.toResponseDto(user);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Supprimer un utilisateur | administrateur',
    description: "Supprimer un utilisateur en fonction de l'identifiant ou de l'UUID fourni",
  })
  @ApiQuery({ name: 'id', required: false, type: String })
  @ApiOkResponse({
    description: "L'utilisateur a été supprimée avec succès",
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: "La suppression de l'utilisateur a échoué",
  })
  @ApiNotFoundResponse({
    description: "L'utilisateur n'a pas été trouvée",
  })
  async deleteUser(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.deleteUser(id);
    return UserMapper.toResponseDto(user);
  }
}
