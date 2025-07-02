import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-event-search-page',
  imports: [
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './event-search-page.component.html',
  styleUrl: './event-search-page.component.scss'
})
export class EventSearchPageComponent {
  onClick() {
    window.location.href = '/accueil';
  }
}
