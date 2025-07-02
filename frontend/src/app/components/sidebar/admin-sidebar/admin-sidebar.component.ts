import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';
import { AdminView } from '../../../utils/admin.views';
import { BreakpointService } from '../../../services/breackpoint.service';

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
  isMobile: boolean = false;
  sidebarOpen: boolean = false;

  expandedSection: 'users' | 'moderation' | 'categories' | 'stats' | 'profile' | null = null;

  constructor(private breakpointService: BreakpointService) {
    this.isMobile = this.breakpointService.isMobile();
    this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  toggleSection(section: 'users' | 'moderation' | 'categories' | 'stats' | 'profile') {
    this.expandedSection = this.expandedSection === section ? null : section;
  }

  select(view: AdminView) {
    this.viewChange.emit(view);
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }

  isSectionActive(section: string) {
    return this.currentView.startsWith(section);
  }
  isViewActive(view: string) {
    return this.currentView === view;
  }
}