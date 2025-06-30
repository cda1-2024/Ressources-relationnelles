import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserView } from '../../../utils/user.views';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-user-sidebar',
  imports: [
    MatListModule,
    MatIconModule,
    NgIf,
    NgClass
  ],
  templateUrl: './user-sidebar.component.html',
  styleUrl: './user-sidebar.component.scss'
})
export class UserSidebarComponent {
  @Input() currentView!: UserView; 
  @Output() viewChange = new EventEmitter<UserView>();

  expandedSection: 'ressources' | 'events' | 'stats' | null = null;

  toggleSection(section: 'ressources' | 'events' | 'stats') {
    this.expandedSection = this.expandedSection === section ? null : section;
  }

  select(view: UserView) {
    this.viewChange.emit(view);
  }

  isSectionActive(section: string) {
    return this.currentView.startsWith(section);
  }
  isViewActive(view: string) {
    return this.currentView === view;
  }
}
