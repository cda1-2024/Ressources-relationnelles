import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { BreakpointService } from '../../services/breackpoint.service';
import { FilterRessourceRequest, RessourceResponse } from '../../services/ressource/ressource.model';
import { Ressourceservice } from '../../services/ressource/ressource.service';
import { RessourceCardComponent } from '../../components/card/ressource-card/ressource-card.component';
import { SwipeScrollDirective } from '../../utils/swipe.directive';
import { FullUserResponse } from '../../services/user/user.model';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '../../services/report/report.service';
import { ReportResponse } from '../../services/report/report.model';
import { ReportCardComponent } from '../../components/card/report-card/report-card.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-view',
  imports: [
    CommonModule,
    RessourceCardComponent,
    ReportCardComponent,
    SwipeScrollDirective,
    MatButtonModule
  ],
  templateUrl: './user-view-page.component.html',
  styleUrls: ['./user-view-page.component.scss']
})
export class UserViewPageComponent implements OnInit {
  @Input() moderate: boolean = true;
  userId: string | null = null;
  user!: FullUserResponse;
  isMobile: boolean = false;
  ressources: RessourceResponse[] = []
  reports: ReportResponse[] = [];

  filterRequest: FilterRessourceRequest = { }

  constructor(
    private breakpointService: BreakpointService,
    private userService: UserService,
    private ressourceService: Ressourceservice,
    private reportService: ReportService,
    private route: ActivatedRoute) {
      this.isMobile = this.breakpointService.isMobile();
      this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
    }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.filterRequest = { creatorId: this.userId, pageSize: 6, page: 1 };
      this.ressourceService.getFilteredPublicRessources(this.filterRequest).subscribe((res) => {
        this.ressources = res.ressources;
      });
      this.userService.getUserById(this.userId).subscribe((user) => {
        this.user = user;
        console.log('User data:', this.user);
      });
      this.reportService.getReportByReportedId(this.userId).subscribe((reports) => {
        this.reports = reports;
        console.log('Reports data:', this.reports);
      });
    }
  }
}