import { Component, EventEmitter, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-sidebar',
  imports: [
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css'],
})
export class AdminSidebarComponent {
  @Output() viewChange = new EventEmitter<'users' | 'moderation' | 'categories' | 'stats'>();

  select(view: 'users' | 'moderation' | 'categories' | 'stats') {
    this.viewChange.emit(view);
  }
}