import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { RessourceResponse } from '../../../services/ressource/ressource.model';

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
  @Input() onClickButton = () => {};
  @Input() isDraft = false;
  @Input() showCreator = true;

  @Output() likeToggled = new EventEmitter<RessourceResponse>();
  @Output() viewClicked = new EventEmitter<RessourceResponse>();

  constructor(private router: Router) {}

  onToggleLike(): void {
    this.likeToggled.emit(this.ressource);
  }

  onViewClick(): void {
    // Naviguer vers la page de détail de la ressource
    this.router.navigate(['/ressources', this.ressource.id]);
    // Émettre l'événement pour compatibilité avec l'ancien code
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
    
    // Vérifier d'abord les extensions de fichiers
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const urlLower = url.toLowerCase();
    const hasImageExtension = imageExtensions.some(ext => urlLower.includes(ext));
    
    if (hasImageExtension) return true;
    
    // Vérifier les domaines/services d'images connus
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
