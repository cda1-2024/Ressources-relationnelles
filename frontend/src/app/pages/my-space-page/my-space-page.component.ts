import { Component } from '@angular/core';
import { BreakpointService } from '../../services/breackpoint.service';
import { AdminSidebarComponent } from '../../components/sidebar/admin-sidebar/admin-sidebar.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { ModerationPanelComponent } from './moderation-panel/moderation-panel.component';
import { StatisticsDashboardComponent } from './statistics-dashboard/statistics-dashboard.component';
import { UserListComponent } from './user-list/user-list.component';
import { CommonModule } from '@angular/common';
import { AdminView } from '../../utils/admin.views';
import { UserCreateComponent } from "./user-create/user-create.component";

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    AdminSidebarComponent,
    CategoryListComponent,
    ModerationPanelComponent,
    StatisticsDashboardComponent,
    UserListComponent,
    UserCreateComponent
],
  templateUrl: './my-space-page.component.html',
  styleUrl: './my-space-page.component.scss',
})
export class MySpacePageComponent {
  isMobile: boolean = false;
  currentView: AdminView = 'users.list';

  constructor(
    private breakpointService: BreakpointService,
  ) {
    this.isMobile = this.breakpointService.isMobile();
    this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }
}
