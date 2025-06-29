import { Component } from '@angular/core';
import { UserView } from '../../utils/user.views';
import { BreakpointService } from '../../services/breackpoint.service';
import { UserSidebarComponent } from "../../components/sidebar/user-sidebar/user-sidebar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-space-user-page',
  imports: [
    UserSidebarComponent,
    CommonModule
  ],
  templateUrl: './my-space-user-page.component.html',
  styleUrl: './my-space-user-page.component.scss'
})
export class MySpaceUserPageComponent {
  isMobile: boolean = false;
  currentView: UserView = 'users.list';

  constructor(
    private breakpointService: BreakpointService,
  ) {
    this.isMobile = this.breakpointService.isMobile();
    this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }
}
