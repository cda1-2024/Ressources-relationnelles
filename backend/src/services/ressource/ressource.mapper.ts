import { Inject } from '@nestjs/common';
import { FullRessourceResponseDto } from 'src/dto/ressource/response/full-ressource-response.dto';
import { RessourceListResponseDto, RessourceResponseDto } from 'src/dto/ressource/response/list-ressource-response.dto';
import { CommentDto } from 'src/dto/ressource/response/common-dtos.dto';
import { RessourceStatusToInt, RessourceTypeToInt, RessourceVisibilityToInt } from 'src/helper/enum-mapper';
import { Ressource } from 'src/models/ressource.model';
import { RessourceService } from 'src/services/ressource/ressource.service';

export class RessourceMapper {
  private readonly ressourceService: RessourceService;
  constructor(@Inject(RessourceService) ressourceService: RessourceService) {
    this.ressourceService = ressourceService;
  }

  static toResponseDto(ressource: Ressource): RessourceResponseDto {
    return {
      id: ressource.id,
      title: ressource.title,
      category: ressource.category?.name,
      content_link: ressource.contentLink,
      content_text: ressource.contentText,
      created_at: ressource.createdAt.toISOString(),
      creator: {
        id: ressource.creator.id,
        username: ressource.creator.username,
      },
      status: {
        id: RessourceStatusToInt[ressource.status],
        label: ressource.status,
      },
      visibility: {
        id: RessourceVisibilityToInt[ressource.visibility],
        label: ressource.visibility,
      },
      type: {
        id: RessourceTypeToInt[ressource.ressourceType],
        label: ressource.ressourceType,
      },
      likeCount: ressource.like,
      commentCount: ressource.comments?.length || 0,
      isLiked: false,
    };
  }

  static toResponseListDto(
    ressources: Ressource[],
    pageNumber: number,
    pageSize: number,
    totalNumberRessources: number,
  ): RessourceListResponseDto {
    return {
      ressources: ressources.map((ressource) => this.toResponseDto(ressource)),
      pageNumber,
      pageSize,
      totalNumberRessources,
      totalPages: Math.ceil(totalNumberRessources / pageSize),
    };
  }
  static toFullResponseDto(ressource: Ressource): FullRessourceResponseDto {
    const commentsMap = new Map<string, CommentDto>();
    const rootComments: CommentDto[] = [];

    ressource.comments?.forEach((comment) => {
      const commentDto: CommentDto = {
        id: comment.id,
        content: comment.message,
        created_at: comment.createdAt.toISOString(),
        author: {
          id: comment.author?.id || '',
          username: comment.author?.username || 'Utilisateur supprimé',
        },
        parent_comment_id: comment.parentComment?.id || undefined,
        replies: [],
      };
      commentsMap.set(comment.id, commentDto);
    });

    ressource.comments?.forEach((comment) => {
      const commentDto = commentsMap.get(comment.id);
      if (commentDto) {
        if (comment.parentComment?.id) {
          const parentComment = commentsMap.get(comment.parentComment.id);
          if (parentComment && parentComment.replies) {
            parentComment.replies.push(commentDto);
          }
        } else {
          rootComments.push(commentDto);
        }
      }
    });

    const countAllComments = (comments: CommentDto[]): number => {
      let count = comments.length;
      comments.forEach((comment) => {
        if (comment.replies && comment.replies.length > 0) {
          count += countAllComments(comment.replies);
        }
      });
      return count;
    };

    return {
      id: ressource.id,
      title: ressource.title,
      content_link: ressource.contentLink,
      content_text: ressource.contentText,
      admin_validation: ressource.adminValidation,
      date_time_validation: ressource.dateTimeValidation?.toISOString(),
      created_at: ressource.createdAt.toISOString(),
      like: ressource.like,
      likeCount: ressource.like,
      commentCount: countAllComments(rootComments),
      status: {
        id: RessourceStatusToInt[ressource.status],
        label: ressource.status,
      },
      visibility: {
        id: RessourceVisibilityToInt[ressource.visibility],
        label: ressource.visibility,
      },
      type: {
        id: RessourceTypeToInt[ressource.ressourceType],
        label: ressource.ressourceType,
      },
      creator: {
        id: ressource.creator.id,
        username: ressource.creator.username,
      },
      validator: {
        id: ressource.validator?.id,
        username: ressource.validator?.username,
      },
      comments: rootComments,
      category: {
        id: ressource.category?.id,
        title: ressource.category?.name,
      },
    };
  }
}
