import { Component } from '@angular/core';
import { BreakpointService } from '../../services/breackpoint.service';
import { AdminSidebarComponent } from '../../components/sidebar/admin-sidebar/admin-sidebar.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { ModerationPanelComponent } from './moderation-panel/moderation-panel.component';
import { StatisticsDashboardComponent } from './statistics-dashboard/statistics-dashboard.component';
import { UserListComponent } from './user-list/user-list.component';
import { CommonModule, NgClass } from '@angular/common';
import { AdminView } from '../../utils/admin.views';
import { UserCreateComponent } from "./user-create/user-create.component";
import { CategoryCreateComponent } from "./category-create/category-create.component";
import { ProfilPageComponent } from "../profil-page/profil-page.component";

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    AdminSidebarComponent,
    CategoryListComponent,
    ModerationPanelComponent,
    StatisticsDashboardComponent,
    UserListComponent,
    UserCreateComponent,
    CategoryCreateComponent,
    ProfilPageComponent,
],
  templateUrl: './my-space-admin-page.component.html',
  styleUrl: './my-space-admin-page.component.scss',
})
export class MySpaceAdminPageComponent {
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
