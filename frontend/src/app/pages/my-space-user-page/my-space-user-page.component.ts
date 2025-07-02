import { Component } from '@angular/core';
import { UserView } from '../../utils/user.views';
import { BreakpointService } from '../../services/breackpoint.service';
import { UserSidebarComponent } from "../../components/sidebar/user-sidebar/user-sidebar.component";
import { CommonModule } from '@angular/common';
import { MyCreatedRessourcesComponent } from "./my-created-ressources/my-created-ressources.component";
import { MyEventsComponent } from "./my-events/my-events.component";
import { EventCreateComponent } from "./event-create/event-create.component";
import { StatisticsDashboardComponent } from "./statistics-dashboard/statistics-dashboard.component";
import { MySavedRessourcesComponent } from './my-saved-ressources/my-saved-ressources.component';
import { CreationRessourcePageComponent } from './create-ressource/create-ressource-page.component';

@Component({
  selector: 'app-my-space-user-page',
  imports: [
    UserSidebarComponent,
    CommonModule,
    MyCreatedRessourcesComponent,
    MySavedRessourcesComponent,
    MyEventsComponent,
    EventCreateComponent,
    StatisticsDashboardComponent,
    CreationRessourcePageComponent,
],
  templateUrl: './my-space-user-page.component.html',
  styleUrl: './my-space-user-page.component.scss'
})
export class MySpaceUserPageComponent {
  isMobile: boolean = false;
  currentView: UserView = 'ressources.list';

  constructor(
    private breakpointService: BreakpointService,
  ) {
    this.isMobile = this.breakpointService.isMobile();
    this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }
}
