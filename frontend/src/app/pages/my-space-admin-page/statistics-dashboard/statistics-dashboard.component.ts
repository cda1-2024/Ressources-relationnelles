import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-statistics-dashboard',
  imports: [
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './statistics-dashboard.component.html',
  styleUrl: './statistics-dashboard.component.scss'
})
export class StatisticsDashboardComponent {
  onClick() {
    window.location.href = '/accueil';
  }
}
