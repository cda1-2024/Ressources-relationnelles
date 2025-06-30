import { ApiProperty } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  postId: string;
  @ApiProperty()
  userId: string;
  @ApiProperty({ required: false })
  parentId?: string;
  @ApiProperty()
  childComments?: CommentResponseDto[];
  @ApiProperty()
  createdAt: Date;
}

export class ListCommentResponseDto {
  comments: CommentResponseDto[];
}
