import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/dto/ressource/response/common-dtos.dto';

export class FullCategoryResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  iconPath: string;
  @ApiProperty()
  color: string;
  @ApiProperty()
  deleted: boolean;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  lastAutor: UserDto;
}
