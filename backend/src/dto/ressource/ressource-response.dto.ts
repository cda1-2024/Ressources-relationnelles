import { ApiProperty } from '@nestjs/swagger';
import { RessourceStatusDto, RessourceTypeDto, RessourceVisiblityDto, UserDto } from './common-dtos.dto';

export class RessourceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  content_link: string;

  @ApiProperty()
  content_text: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty({ type: UserDto })
  creator: UserDto;

  @ApiProperty({ type: RessourceStatusDto})
  status: RessourceStatusDto;
  
  @ApiProperty({ type: RessourceVisiblityDto})
  visibility: RessourceVisiblityDto;

  @ApiProperty({ type: RessourceTypeDto })
  type: RessourceTypeDto;
}

export class RessourceListResponseDto {
  @ApiProperty({ type: [RessourceResponseDto] })
  data: RessourceResponseDto[];
}
