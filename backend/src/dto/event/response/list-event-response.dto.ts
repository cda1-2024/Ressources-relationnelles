import { ApiProperty } from '@nestjs/swagger';
import { EventTypeDto, UserDto } from 'src/dto/ressource/response/common-dtos.dto';

export class EventResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: EventTypeDto })
  type: EventTypeDto;

  @ApiProperty({ type: UserDto })
  manager: UserDto;
}

export class EventListResponseDto {
  @ApiProperty({ type: [EventResponseDto] })
  events: EventResponseDto[];

  @ApiProperty()
  pageNumber: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalNumberEvents: number;

  @ApiProperty()
  totalPages: number;
}
