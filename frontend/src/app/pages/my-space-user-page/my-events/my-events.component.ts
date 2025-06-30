import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SwipeScrollDirective } from '../../../utils/swipe.directive';
import { BreakpointService } from '../../../services/breackpoint.service';
import { EventService } from '../../../services/event/event.service';
import { BigEventCardComponent } from '../../../components/card/big-event-card/big-event-card.component';
import { EventListResponse } from '../../../services/event/event.model';
import { getImageForEventType } from '../../../utils/event.util';

@Component({
  selector: 'app-my-events',
  imports: [
    CommonModule,
    MatIconModule,
    BigEventCardComponent,
    RouterModule,
    SwipeScrollDirective
  ],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.scss'
})
export class MyEventsComponent implements OnInit {
  isMobile: boolean = false;

  inProgressEvents: any[] = [];
  finishedEvents: any[] = [];

  constructor(
      private breakpointService: BreakpointService,
      private eventService: EventService
    ) {
      this.isMobile = this.breakpointService.isMobile();
      this.breakpointService.isMobile$.subscribe((isMobile) => {
        this.isMobile = isMobile;
      });
    }

  ngOnInit(): void {
    this.eventService.getFilterEvents(6).subscribe((res: EventListResponse) => {
      this.inProgressEvents = res.events.map((event) => ({      
        id: event.id,
        title: event.title,
        imageUrl: getImageForEventType(event.type.id),
        user: {
          name: event.manager.username,
          avatarUrl: 'https://i.pravatar.cc/40?u=',
        },
        people: Math.floor(Math.random() * 100),
        tchats: Math.floor(Math.random() * 20),
      }));
    });
    this.eventService.getFilterEvents(6).subscribe((res: EventListResponse) => {
      this.finishedEvents = res.events.map((event) => ({
        id: event.id,
        title: event.title,
        imageUrl: getImageForEventType(event.type.id),
        user: {
          name: event.manager.username,
          avatarUrl: 'https://i.pravatar.cc/40?u=',
        },
        people: Math.floor(Math.random() * 100),
        tchats: Math.floor(Math.random() * 20),
      }));
    });  
  }
}
