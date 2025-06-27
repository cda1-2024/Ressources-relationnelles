import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BigRessourceCardComponent } from '../../components/card/big-ressource-card/big-ressource-card.component';
import { BigEventCardComponent } from '../../components/card/big-event-card/big-event-card.component';
import { BigUserCardComponent } from '../../components/card/big-user-card/big-user-card.component';
import { BreakpointService } from '../../services/breackpoint.service';
import { EventService } from '../../services/event/event.service';
import { EventListResponse } from '../../services/event/event.model';
import { getImageForEventType } from '../../utils/event.util';
import { UserService } from '../../services/user/user.service';
import { Ressourceservice } from '../../services/ressource/ressource.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatIconModule,
    BigRessourceCardComponent,
    BigEventCardComponent,
    BigUserCardComponent,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  isMobile: boolean = false;
  

  events: any[] = [];

  users: any[] = [];

  ressources: any[] = [];

  constructor(
    private breakpointService: BreakpointService,
    private eventService: EventService,
    private userService: UserService,
    private ressourceService: Ressourceservice
  ) {
    this.isMobile = this.breakpointService.isMobile();
    this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }
  ngOnInit(): void {
    this.eventService.getFilterEvents(6).subscribe((res: EventListResponse) => {
      this.events = res.events
      .map(event => ({
        id: event.id,
        title: event.title,
        imageUrl: getImageForEventType(event.type.id),
        user: {
          name: event.manager.username,
          avatarUrl: 'https://i.pravatar.cc/40?u='
        },
        people: Math.floor(Math.random() * 100),
        tchats: Math.floor(Math.random() * 20)
      }),);
    });
    this.userService.getFilterUsers(3, false).subscribe((res) => {
      this.users = res.users
        .map(user => ({
          id: user.id,
          username: user.username,
          avatarUrl: 'https://i.pravatar.cc/40?u=' + user.id,
          bio: user.bio || 'No bio available',
          events: user.ressourcesCount,
          ressources: user.eventsCount,
        }));
    });
    this.ressourceService.getFilterRessources(6).subscribe((res) => {
      console.log(res);
      this.ressources = res.ressources
        .map(ressource => ({
          id: ressource.id,
          title: ressource.title,
          imageUrl: ressource.content_link || 'https://picsum.photos/300/200?random=' + ressource.id,
          user: {
            name: ressource.creator.username,
            avatarUrl: 'https://i.pravatar.cc/40?u=' + ressource.creator.id
          },
          likes: ressource.likeCount,
          comments: ressource.commentCount
        }));
    });
  }
}
