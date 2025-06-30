import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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
  @Input({ required: true }) article!: RessourceResponse;
  @Input() showViewButton = true;
  @Input() showActions = true;

  @Output() likeToggled = new EventEmitter<RessourceResponse>();
  @Output() viewClicked = new EventEmitter<RessourceResponse>();

  onToggleLike(): void {
    this.likeToggled.emit(this.article);
  }

  onViewClick(): void {
    this.viewClicked.emit(this.article);
  }

  formatCount(count: number): string {
    if (count >= 1000000) return Math.floor(count / 100000) / 10 + 'M';
    if (count >= 1000) return Math.floor(count / 1000) + 'k';
    return count.toString();
  }

  getResourceIcon(): string {
    const type = this.article.type?.label?.toLowerCase();
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
}
