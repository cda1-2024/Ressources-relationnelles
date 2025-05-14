import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/models/user.model';

export class FullUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uuidGoogle: string;

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

  @ApiProperty()
  city: string;

  @ApiProperty()
  region: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
