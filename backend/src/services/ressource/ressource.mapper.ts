import { FullRessourceResponseDto } from 'src/dto/ressource/full-ressource-response.dto';
import {
  RessourceListResponseDto,
  RessourceResponseDto,
} from 'src/dto/ressource/ressource-response.dto';
import {
  RessourceStatusToInt,
  RessourceTypeToInt,
  RessourceVisibilityToInt,
} from 'src/helper/enumMapper';
import { Ressource } from 'src/models/ressource.model';

export class RessourceMapper {
  static toResponseDto(ressource: Ressource): RessourceResponseDto {
    return {
      id: ressource.id,
      title: ressource.title,
      category: ressource.category.name,
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
    };
  }

  static toResponseListDto(ressources: Ressource[]): RessourceListResponseDto {
    return {
      data: ressources.map((ressource) => this.toResponseDto(ressource)),
    };
  }

  static toFullResponseDto(ressource: Ressource): FullRessourceResponseDto {
    return {
      id: ressource.id,
      title: ressource.title,
      content_link: ressource.contentLink,
      content_text: ressource.contentText,
      admin_validation: ressource.adminValidation,
      date_time_validation: ressource.dateTimeValidation?.toISOString(),
      created_at: ressource.createdAt.toISOString(),
      like: ressource.like,
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
      comments: ressource.comments?.map((comment) => ({
        id: comment.id,
        content: comment.message,
        created_at: comment.createdAt.toISOString(),
        autor: {
          id: comment.autor.id,
          username: comment.autor.username,
        },
      })),
      category: {
        id: ressource.category.id,
        title: ressource.category.name,
      },
    };
  }
}
