import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto, CommentDto, RessourceStatusDto, RessourceTypeDto, RessourceVisiblityDto, UserDto } from './common-dtos.dto';

export class FullRessourceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content_link: string;

  @ApiProperty()
  content_text: string;

  @ApiProperty()
  admin_validation: boolean;

  @ApiProperty()
  date_time_validation: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  like: number;

  @ApiProperty({ type: RessourceStatusDto})
  status: RessourceStatusDto;

  @ApiProperty({ type: RessourceVisiblityDto})
  visibility: RessourceVisiblityDto;

  @ApiProperty({ type: RessourceTypeDto})
  type: RessourceTypeDto;

  @ApiProperty({ type: UserDto })
  creator: UserDto;

  @ApiProperty({ type: UserDto })
  validator: UserDto;

  @ApiProperty({ type: [CommentDto] })
  comments: CommentDto[];

  @ApiProperty({ type: CategoryDto})
  category: CategoryDto;
}
