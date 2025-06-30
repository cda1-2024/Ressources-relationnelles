import { User } from 'src/models/user.model';
import { UserResponseDto, ListUserResponseDto } from 'src/dto/user/response/list-user-response.dto';
import { UserRoleToInt } from 'src/helper/enum-mapper';
import { FullUserResponseDto } from 'src/dto/user/response/full-user-response.dto';

export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      bio: user.bio,
      banned: user.banned,
      disabled: user.disabled,
      role: UserRoleToInt[user.role],
      eventsCount: user.eventsCount,
      ressourcesCount: user.ressourcesCount,
    };
  }

  static toResponseListDto(
    users: User[],
    pageNumber: number,
    pageSize: number,
    totalNumberUser: number,
  ): ListUserResponseDto {
    return {
      users: users.map((user) => this.toResponseDto(user)),
      pageNumber,
      pageSize,
      totalNumberUser,
      totalPages: Math.ceil(totalNumberUser / pageSize),
    };
  }

  static toResponseFullDto(user: User): FullUserResponseDto {
    return {
      id: user.id,
      uuidGoogle: user.uuidGoogle,
      email: user.email,
      username: user.username,
      bio: user.bio,
      banned: user.banned,
      disabled: user.disabled,
      role: UserRoleToInt[user.role],
      city: user.city,
      region: user.region,
      country: user.country,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
