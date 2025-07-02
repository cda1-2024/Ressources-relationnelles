import { Injectable } from '@nestjs/common';
import { FullCommentResponseDto } from 'src/dto/comment/response/full-comment-response.dto';
import { CommentResponseDto, ListCommentResponseDto } from 'src/dto/comment/response/list-comment-response.dto';
import { Comment } from 'src/models/comment.model';

@Injectable()
export class CommentMapper {
  static toResponseDto(comment: Comment): CommentResponseDto {
    return {
      id: comment.id,
      message: comment.message,
      postId: comment.ressource.id,
      userId: comment.author.id,
      parentId: comment.parentComment?.id ?? null,
      childComments: comment.childComments?.slice(0, 1).map((child) => this.toResponseDto(child)),
      createdAt: comment.createdAt,
    };
  }
  static toResponseListDto(comments: Comment[]): ListCommentResponseDto {
    return {
      comments: comments.map((comment) => this.toResponseDto(comment)),
    };
  }
  static toResponseFullDto(comment: Comment): FullCommentResponseDto {
    return {
      id: comment.id,
      message: comment.message,
      postId: comment.ressource.id,
      userId: comment.author.id,
      parentId: comment.parentComment?.id ?? null,
      childComments: comment.childComments?.map((childComment) => this.toResponseFullDto(childComment)) ?? null,
      createdAt: comment.createdAt,
    };
  }
}
