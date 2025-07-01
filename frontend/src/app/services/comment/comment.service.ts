import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { Comment } from '../ressource/ressource.model';

export interface CreateCommentRequest {
  message: string;
  ressourceId: string;
  parentId?: string;
}

export interface CreateCommentResponse {
  id: string;
  message: string;
  postId: string;
  userId: string;
  parentId?: string;
  childComments?: CreateCommentResponse[];
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private api: ApiService) {}

  /**
   * Créer un nouveau commentaire ou une réponse à un commentaire
   */
  createComment(request: CreateCommentRequest): Observable<CreateCommentResponse> {
    return this.api.post<CreateCommentResponse>('/comments', request);
  }

  /**
   * Récupérer les commentaires d'une ressource (optionnel - pourrait être utilisé pour rafraîchir)
   */
  getCommentsByRessourceId(ressourceId: string): Observable<Comment[]> {
    return this.api.get<Comment[]>(`/comments/ressources/${ressourceId}`);
  }

  /**
   * Supprimer un commentaire (optionnel pour plus tard)
   */
  deleteComment(commentId: string): Observable<void> {
    return this.api.delete<void>(`/comments/${commentId}`);
  }

  /**
   * Modifier un commentaire (optionnel pour plus tard)
   */
  updateComment(commentId: string, content: string): Observable<CreateCommentResponse> {
    return this.api.put<CreateCommentResponse>(`/comments/${commentId}`, { message: content });
  }
}
