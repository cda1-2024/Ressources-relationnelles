import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;
}

export class RessourceTypeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  label: string;
}

export class RessourceStatusDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  label: string;
}

export class RessourceVisiblityDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  label: string;
}

export class EventTypeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  label: string;
}

export class CategoryDto {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  title?: string;
}

export class CommentDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: UserDto })
  author: UserDto;

  @ApiProperty()
  content: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty({ type: CommentDto, isArray: true, required: false })
  replies?: CommentDto[];

  @ApiProperty({ required: false })
  parent_comment_id?: string;
}
