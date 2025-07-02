import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DomSanitizer, SafeHtml, SafeResourceUrl, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Ressourceservice } from '../../services/ressource/ressource.service';
import { RessourceResponse } from '../../services/ressource/ressource.model';
import { AuthService } from '../../auth/auth.service';
import { CommentService, CreateCommentRequest } from '../../services/comment/comment.service';
import { environment } from '../../../environments/environment'; 

@Component({
  selector: 'app-ressource-detail-page',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './ressource-detail-page.component.html',
  styleUrl: './ressource-detail-page.component.scss'
})
export class RessourceDetailPageComponent implements OnInit, OnDestroy {
  ressource: RessourceResponse | null = null;
  isLoading = true;
  error: string | null = null;
  sanitizedContent: SafeHtml = '';
  
  activeReplyForm: string | null = null;
  replyText: string = '';
  isSubmittingReply = false;
  
  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private ressourceService: Ressourceservice,
    private commentService: CommentService,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      const ressourceId = params['id'];
      if (ressourceId) {
        this.loadRessource(ressourceId);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/ressources']);
    }
  }

  toggleLike(): void {
    if (this.ressource) {
      this.ressource.isLiked = !this.ressource.isLiked;
      const currentCount = this.ressource.likeCount || 0;
      this.ressource.likeCount = this.ressource.isLiked ? currentCount + 1 : currentCount - 1;
      // TODO: Appeler l'API pour sauvegarder le like
    }
  }

  formatCount(count: number | undefined): string {
    if (count === undefined || count === null || isNaN(count)) return '0';
    if (count >= 1000000) return Math.floor(count / 100000) / 10 + 'M';
    if (count >= 1000) return Math.floor(count / 1000) + 'k';
    return count.toString();
  }

  getResourceIcon(): string {
    if (!this.ressource) return 'description';
    
    const type = this.ressource.type?.label?.toLowerCase();
    switch (type) {
      case 'vidéo':
      case 'video':
        return 'play_circle';
      case 'image':
        return 'image';
      case 'pdf':
        return 'picture_as_pdf';
      case 'texte':
      case 'text':
      default:
        return 'description';
    }
  }

  getResourceType(): string {
    if (!this.ressource) return 'text';
    return this.ressource.type?.label?.toLowerCase() || 'text';
  }

  isTextType(): boolean {
    const type = this.getResourceType();
    return type === 'texte' || type === 'text';
  }

  isImageType(): boolean {
    return this.getResourceType() === 'image';
  }

  isVideoType(): boolean {
    const type = this.getResourceType();
    return type === 'vidéo' || type === 'video';
  }

  getYouTubeEmbedUrl(): SafeResourceUrl {
    if (!this.ressource?.content_link) return this.sanitizer.bypassSecurityTrustResourceUrl('');
    
    const url = this.ressource.content_link;
    let embedUrl = '';
    
    // Convertir les URLs YouTube en URLs d'embed
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else {
      embedUrl = url;
    }
    
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  getImgUrl(): string {
      if (this.ressource?.content_link) {
        // Si le lien est déjà complet, on le retourne tel quel
        if (this.ressource.content_link.startsWith('http://') || this.ressource.content_link.startsWith('https://')) {
          return this.ressource.content_link;
        }
        // Sinon, on le concatène avec l'URL de base
        return `${environment.urlMedia}${this.ressource.content_link}`;
      }
      return '';
    }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }

  hasComments(): boolean {
    return !!(this.ressource?.comments && this.ressource.comments.length > 0);
  }

  getTotalCommentsCount(): number {
    if (!this.ressource?.comments) return 0;
    
    const countComments = (comments: any[]): number => {
      let count = comments.length;
      comments.forEach(comment => {
        if (comment.replies && comment.replies.length > 0) {
          count += countComments(comment.replies);
        }
      });
      return count;
    };

    return countComments(this.ressource.comments);
  }

  // Méthodes pour les réponses aux commentaires
  canReply(comment: any, depth: number = 0): boolean {
    // Peut répondre seulement si:
    // 1. L'utilisateur est connecté
    // 2. Le niveau de profondeur est inférieur à 2 (0: commentaire principal, 1: première réponse)
    return this.authService.isLoggedIn() && depth < 2;
  }

  showReplyForm(commentId: string): void {
    this.activeReplyForm = commentId;
    this.replyText = '';
  }

  hideReplyForm(): void {
    this.activeReplyForm = null;
    this.replyText = '';
  }

  isReplyFormVisible(commentId: string): boolean {
    return this.activeReplyForm === commentId;
  }

  submitReply(parentCommentId: string): void {
    if (!this.replyText.trim() || !this.authService.isLoggedIn() || !this.ressource) {
      return;
    }

    this.isSubmittingReply = true;
    
    const createCommentRequest: CreateCommentRequest = {
      message: this.replyText.trim(),
      ressourceId: this.ressource.id,
      parentId: parentCommentId
    };

    this.commentService.createComment(createCommentRequest).subscribe({
      next: (response) => {
        this.isSubmittingReply = false;
        this.hideReplyForm();
        
        this.loadRessource(this.ressource!.id);
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi de la réponse:', error);
        this.isSubmittingReply = false;
        
        // TODO: Afficher un message d'erreur à l'utilisateur
        // Pour l'instant, on garde le formulaire ouvert pour permettre de réessayer
        alert('Erreur lors de l\'envoi du commentaire. Veuillez réessayer.');
      }
    });
  }

  private loadRessource(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.ressourceService.getRessourceById(id).subscribe({
      next: (ressource) => {
        this.ressource = ressource;
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(ressource.content_text || '');
        this.titleService.setTitle(`${ressource.title} - Ressources`);
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Impossible de charger la ressource. Elle n\'existe peut-être pas ou vous n\'avez pas les droits d\'accès.';
        this.titleService.setTitle('Ressource introuvable');
        this.isLoading = false;
      }
    });
  }
}
