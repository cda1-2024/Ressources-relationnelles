import { ApiProperty } from '@nestjs/swagger';
import { CommentResponseDto } from './list-comment-response.dto';

export class FullCommentResponseDto {
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
  @ApiProperty({ type: [FullCommentResponseDto], required: false })
  childComments?: CommentResponseDto[];
  @ApiProperty()
  createdAt: Date;
}
