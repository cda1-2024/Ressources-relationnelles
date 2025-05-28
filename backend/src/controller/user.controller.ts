import { Body, Controller, Get, Param, Put, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
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
import { ListUserRequestDto } from 'src/dto/user/request/list-user-request.dto';
import { ListUserResponseDto, UserResponseDto } from 'src/dto/user/response/list-user-response.dto';
import { FullUserResponseDto } from 'src/dto/user/response/full-user-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { updateMyAccountDto as updateMyAccountDto } from '../dto/user/request/update-my-account.dto';
import { UserMapper } from 'src/services/user/user.mapper';
import { User } from 'src/models/user.model';
import { CurrentUser } from 'src/middleware/guards/current-user.decorator';
import { FilterUserRequestDto } from 'src/dto/user/request/filter-user.dto';

@ApiTags('Users')
@ApiExtraModels(
  ListUserRequestDto,
  ListUserResponseDto,
  UserResponseDto,
  FullUserResponseDto,
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
  @ApiQuery({ name: 'banned', required: false, type: Boolean })
  @ApiQuery({ name: 'disabled', required: false, type: Boolean })
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
    description: 'Structure du JSON pour mettre son compte',
  })
  @ApiExtraModels(updateMyAccountDto)
  @ApiOkResponse({
    description: 'Les informations de l’utilisateur',
    type: FullUserResponseDto,
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
    const user = await this.userService.updateUser(id, updateUserDto);
    return UserMapper.toResponseDto(user);
  }
}
