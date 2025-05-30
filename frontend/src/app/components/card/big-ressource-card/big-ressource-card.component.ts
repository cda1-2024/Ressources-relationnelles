import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-big-ressource-card',
  imports: [
    MatCardModule, 
    MatButtonModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './big-ressource-card.component.html',
  styleUrl: './big-ressource-card.component.scss'
})
export class BigRessourceCardComponent {
  @Input() resource!: {
    title: string;
    imageUrl: string;
    user: {
      name: string;
      avatarUrl: string;
    };
    likes: number;
    comments: number;
  };
}
