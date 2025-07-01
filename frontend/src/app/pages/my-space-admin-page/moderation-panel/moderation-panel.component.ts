import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { RessourceCardComponent } from '../../../components/card/ressource-card/ressource-card.component';
import { SwipeScrollDirective } from '../../../utils/swipe.directive';
import { UserResponse } from '../../../services/user/user.model';
import { RessourceResponse } from '../../../services/ressource/ressource.model';
import { BreakpointService } from '../../../services/breackpoint.service';
import { Ressourceservice } from '../../../services/ressource/ressource.service';
import { UserService } from '../../../services/user/user.service';
import { BigUserCardComponent } from '../../../components/card/big-user-card/big-user-card.component';
import { sign } from 'crypto';

@Component({
  selector: 'app-moderation-panel',
  imports: [
    CommonModule,
    MatIconModule,
    RessourceCardComponent,
    BigUserCardComponent,
    RouterModule,
    SwipeScrollDirective
  ],
  templateUrl: './moderation-panel.component.html',
  styleUrl: './moderation-panel.component.scss'
})
export class ModerationPanelComponent implements OnInit {
  isMobile: boolean = false;

  susUser: any[] = [];
  waitingRessources: RessourceResponse[] = [];

  constructor(
    private breakpointService: BreakpointService,
    private userService: UserService,
    private ressourceService: Ressourceservice
  ) {
    this.isMobile = this.breakpointService.isMobile();
    this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  ngOnInit(): void {
    this.userService
      .getFilterUsers({
        pageSize: 6,
        page: 1,
        disabled: false,
      })
      .subscribe((res) => {
        this.susUser = res.users.map((user) => ({
          id: user.id,
          username: user.username,
          avatarUrl: 'https://i.pravatar.cc/40?u=' + user.id,
          bio: user.bio || 'No bio available',
          events: user.ressourcesCount,
          ressources: user.eventsCount,
          signalements: Math.floor(Math.random() * 100),
        }));
      });
    this.ressourceService.getFilterRessources(6).subscribe((res) => {
      this.waitingRessources = res.ressources;
    });
  }
}
