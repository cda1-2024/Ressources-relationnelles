import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-big-event-card',
  imports: [MatCardModule, MatButtonModule, CommonModule, MatIconModule],
  templateUrl: './big-event-card.component.html',
  styleUrl: './big-event-card.component.scss',
})
export class BigEventCardComponent {
  @Input() event!: {
    id: string;
    title: string;
    imageUrl: string;
    user: {
      name: string;
      avatarUrl: string;
    };
    people: number;
    tchats: number;
  };
}
