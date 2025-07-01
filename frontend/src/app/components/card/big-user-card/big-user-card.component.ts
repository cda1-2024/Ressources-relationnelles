import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { on } from 'events';

@Component({
  selector: 'app-big-user-card',
  imports: [MatCardModule, MatButtonModule, CommonModule, MatIconModule],
  templateUrl: './big-user-card.component.html',
  styleUrl: './big-user-card.component.scss',
})
export class BigUserCardComponent {
  @Input() user!: {
    id: string,
    username: string;
    avatarUrl: string;
    bio: string;
    ressources: number;
    events: number;
    signalements?: number;
  };

  @Input() moderate = false;

  constructor(private router: Router) {
  }
  
  onUserClick(userId: string): void {
    console.log('Navigating to user:', this.moderate, userId);

    this.router.navigate(['/utilisateurs', userId], {
      state: { moderate: this.moderate },
    });
  }
}
