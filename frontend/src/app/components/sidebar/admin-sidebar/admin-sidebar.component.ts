import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';
import { AdminView } from '../../../utils/admin.views';

@Component({
  selector: 'app-admin-sidebar',
  imports: [
    MatListModule,
    MatIconModule,
    NgIf,
    NgClass
  ],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
})
export class AdminSidebarComponent {
  @Input() currentView!: AdminView; 
  @Output() viewChange = new EventEmitter<AdminView>();

  expandedSection: 'users' | 'moderation' | 'categories' | 'stats' | null = null;

  toggleSection(section: 'users' | 'moderation' | 'categories' | 'stats') {
    this.expandedSection = this.expandedSection === section ? null : section;
  }

  select(view: AdminView) {
    this.viewChange.emit(view);
  }

  isSectionActive(section: string) {
    return this.currentView.startsWith(section);
  }
  isViewActive(view: string) {
    return this.currentView === view;
  }
}