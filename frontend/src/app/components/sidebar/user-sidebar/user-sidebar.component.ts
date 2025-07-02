import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserView } from '../../../utils/user.views';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgClass } from '@angular/common';
import { BreakpointService } from '../../../services/breackpoint.service';

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
  isMobile: boolean = false;
  sidebarOpen: boolean = false;

  expandedSection: 'ressources' | 'events' | 'stats' | 'profile' |  null = null;

  constructor(private breakpointService: BreakpointService) {
    this.isMobile = this.breakpointService.isMobile();
    this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  toggleSection(section: 'ressources' | 'events' | 'stats' | 'profile') {
    this.expandedSection = this.expandedSection === section ? null : section;
  }

  select(view: UserView) {
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
