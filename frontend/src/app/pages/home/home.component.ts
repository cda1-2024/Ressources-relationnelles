import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BigRessourceCardComponent } from '../../components/card/big-ressource-card/big-ressource-card.component';
import { BigEventCardComponent } from '../../components/card/big-event-card/big-event-card.component';
import { BigUserCardComponent } from '../../components/card/big-user-card/big-user-card.component';
import { BreakpointService } from '../../services/breackpoint.service';

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
export class HomeComponent {
  isMobile: boolean = false;
  resources = [
    {
      id: 1,
      title: 'Titre 1',
      imageUrl: 'https://picsum.photos/400/250?random=1',
      user: {
        name: 'Alice',
        avatarUrl: 'https://i.pravatar.cc/40?u=alice'
      },
      likes: 42,
      comments: 13
    },
    {
      id: 2,
      title: 'Titre 2',
      imageUrl: 'https://picsum.photos/400/250?random=2',
      user: {
        name: 'Bob',
        avatarUrl: 'https://i.pravatar.cc/40?u=bob'
      },
      likes: 8,
      comments: 5
    },
    {
      id: 3,
      title: 'Titre 3',
      imageUrl: 'https://picsum.photos/400/250?random=3',
      user: {
        name: 'Bob',
        avatarUrl: 'https://i.pravatar.cc/40?u=bob'
      },
      likes: 8,
      comments: 5
    },
    {
      id: 4,
      title: 'Titre 4',
      imageUrl: 'https://picsum.photos/400/250?random=4',
      user: {
        name: 'Bob',
        avatarUrl: 'https://i.pravatar.cc/40?u=bob'
      },
      likes: 8,
      comments: 5
    }
  ];

  events = [
    {
      id: 1,
      title: 'Titre 1',
      imageUrl: 'assets/img/presentationPage/imgActivite.jpg',
      user: {
        name: 'Alice',
        avatarUrl: 'https://i.pravatar.cc/40?u=alice'
      },
      people: 42,
      tchats: 13
    },
    {
      id: 2,
      title: 'Titre 2',
      imageUrl: 'assets/img/presentationPage/imgActivite.jpg',
      user: {
        name: 'Bob',
        avatarUrl: 'https://i.pravatar.cc/40?u=bob'
      },
      people: 8,
      tchats: 5
    },
    {
      id: 3,
      title: 'Titre 3',
      imageUrl: 'assets/img/presentationPage/imgActivite.jpg',
      user: {
        name: 'Bob',
        avatarUrl: 'https://i.pravatar.cc/40?u=bob'
      },
      people: 8,
      tchats: 5
    },
    {
      id: 4,
      title: 'Titre 4',
      imageUrl: 'assets/img/presentationPage/imgActivite.jpg',
      user: {
        name: 'Bob',
        avatarUrl: 'https://i.pravatar.cc/40?u=bob'
      },
      people: 8,
      tchats: 5
    }
  ];

  users = [
    {
      id: 1,
      username: 'Alice',
      avatarUrl: 'https://i.pravatar.cc/40?u=alice',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      ressources: 42,
      events: 13
    },
    {
      id: 2,
      username: 'Bob',
      avatarUrl: 'https://i.pravatar.cc/40?u=bob',
      bio: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      ressources: 8,
      events: 5
    },
    {
      id: 3,
      username: 'Charlie',
      avatarUrl: 'https://i.pravatar.cc/40?u=charlie',
      bio: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      ressources: 15,
      events: 7
    }
  ];

  constructor(
    private breakpointService: BreakpointService,
  ) {
    this.isMobile = this.breakpointService.isMobile();
    this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }
}
