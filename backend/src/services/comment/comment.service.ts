import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from 'src/models/comment.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createLoggedRepository } from 'src/helper/safe-repository';
import { BusinessException } from 'src/helper/exceptions/business.exception';
import { getErrorStatusCode } from 'src/helper/exception-utils';
import { PublishCommentDto } from '../../dto/comment/request/publish-comment.dto';
import { User } from 'src/models/user.model';
import { Ressource } from 'src/models/ressource.model';
import { RessourceService } from './../ressource/ressource.service';

@Injectable()
export class CommentService {
  private readonly commentRepository: Repository<Comment>;
  private readonly ressourceService: RessourceService;
  constructor(@InjectRepository(Comment) commentRepository: Repository<Comment>, ressourceService: RessourceService) {
    this.commentRepository = createLoggedRepository(commentRepository);
    this.ressourceService = ressourceService;
  }

  async getAllCommentsByRessource(idRessource: string): Promise<Comment[]> {
    try {
      return this.commentRepository.find({
        relations: {
          ressource: true,
          author: true,
          parentComment: true,
          childComments: {
            author: true,
            ressource: true,
          },
        },
        where: { ressource: { id: idRessource }, deleted: false },
      });
    } catch (error) {
      throw new BusinessException('La recherche des catégories a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async getCommentById(idComment: string): Promise<Comment> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: idComment, deleted: false },
        relations: {
          ressource: true,
          author: true,
          parentComment: true,
          childComments: {
            parentComment: true,
            author: true,
            ressource: true,
          },
        },
      });
      if (!comment) {
        throw new NotFoundException('Commentaire non trouvé');
      }
      return comment;
    } catch (error) {
      throw new BusinessException('La recherche du commentaire a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async publishComment(user: User, publishComment: PublishCommentDto): Promise<Comment> {
    try {
      const ressource: Ressource = await this.ressourceService.findRessourceById(publishComment.ressourceId);
      let parentComment: Comment | null = null;
      if (publishComment.parentId) {
        parentComment = await this.getCommentById(publishComment.parentId);
        if (parentComment.parentComment != undefined) {
          throw new NotFoundException(
            "Vous ne pouvez pas répondre à ce commentaire, vous pouver répondre qu'à un commentaire de premier niveau",
          );
        }
      }
      const comment = this.commentRepository.create({
        message: publishComment.message,
        ressource: ressource,
        author: user,
        parentComment: parentComment ?? undefined,
      });

      return this.commentRepository.save(comment);
    } catch (error) {
      throw new BusinessException('La publication du commentaire a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async deleteComment(idComment: string): Promise<void> {
    try {
      const comment = await this.getCommentById(idComment);
      await this.commentRepository.update(comment.id, { deleted: true });
    } catch (error) {
      throw new BusinessException('La suppression du commentaire a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }
}
