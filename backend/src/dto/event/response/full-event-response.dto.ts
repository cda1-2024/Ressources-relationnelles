import { ApiProperty } from '@nestjs/swagger';
import { EventTypeDto, UserDto } from 'src/dto/ressource/response/common-dtos.dto';

export class FullEventResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: EventTypeDto })
  type: EventTypeDto;

  @ApiProperty()
  content: string;

  @ApiProperty()
  isRestricted: boolean;

  @ApiProperty()
  deleted: boolean;

  @ApiProperty()
  suspended: boolean;

  @ApiProperty({ type: UserDto })
  manager: UserDto;
}
