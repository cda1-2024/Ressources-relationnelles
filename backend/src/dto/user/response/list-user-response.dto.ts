import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  banned: boolean;

  @ApiProperty()
  disabled: boolean;

  @ApiProperty()
  role: number;
}

export class ListUserResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  users: UserResponseDto[];

  @ApiProperty()
  pageNumber: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalNumberUser: number;

  @ApiProperty()
  totalPages: number;
}
