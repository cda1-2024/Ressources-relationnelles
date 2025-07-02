import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { RessourceResponse } from '../../../services/ressource/ressource.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ressource-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './ressource-card.component.html',
  styleUrl: './ressource-card.component.scss'
})
export class RessourceCardComponent {
  @Input({ required: true }) ressource!: RessourceResponse;
  @Input() showViewButton = true;
  @Input() showActions = true;
  @Input() textButton = 'Voir';
  @Input() onClickButton = (id:string) => {
    this.router.navigate(['/ressources', id]);  
    this.viewClicked.emit(this.ressource);
  };
  @Input() isDraft = false;
  @Input() showCreator = true;

  @Output() likeToggled = new EventEmitter<RessourceResponse>();
  @Output() viewClicked = new EventEmitter<RessourceResponse>();

  constructor(private router: Router) {}

  onUserClick(): void {
    this.router.navigate(['/utilisateur', this.ressource.creator.id]);
  }

  onToggleLike(): void {
    this.likeToggled.emit(this.ressource);
  }

  onViewClick(): void {
    this.router.navigate(['/ressources', this.ressource.id]);
    this.viewClicked.emit(this.ressource);
  }

  formatCount(count: number): string {
    if (count >= 1000000) return Math.floor(count / 100000) / 10 + 'M';
    if (count >= 1000) return Math.floor(count / 1000) + 'k';
    return count.toString();
  }

  getResourceIcon(): string {
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

  hasContentLink(): boolean {
    return !!(this.ressource.content_link && this.ressource.content_link.trim());
  }

  isImageUrl(url: string): boolean {
    if (!url) return false;
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const urlLower = url.toLowerCase();
    const hasImageExtension = imageExtensions.some(ext => urlLower.includes(ext));
    
    if (hasImageExtension) return true;
    
    const imageServices = [
      'picsum.photos',
      'via.placeholder.com',
      'placehold.it',
      'placeholder.com',
      'images.unsplash.com',
      'source.unsplash.com'
    ];
    
    return imageServices.some(service => urlLower.includes(service));
  }
  

  getImgUrl(): string {
    if (this.ressource.content_link) {
      // Si le lien est déjà complet, on le retourne tel quel
      if (this.ressource.content_link.startsWith('http://') || this.ressource.content_link.startsWith('https://')) {
        return this.ressource.content_link;
      }
      // Sinon, on le concatène avec l'URL de base
      return `${environment.urlMedia}${this.ressource.content_link}`;
    }
    return '';
  }

  shouldShowImage(): boolean {
    return this.hasContentLink() && this.isImageUrl(this.ressource.content_link) && this.ressource.type?.label.toLowerCase() == 'image';
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
      const nextElement = target.nextElementSibling as HTMLElement;
      if (nextElement) {
        nextElement.style.display = 'flex';
      }
    }
  }
}
