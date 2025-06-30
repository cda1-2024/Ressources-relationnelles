import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BigRessourceCardComponent } from '../../../components/card/big-ressource-card/big-ressource-card.component';
import { BreakpointService } from '../../../services/breackpoint.service';
import { Ressourceservice } from '../../../services/ressource/ressource.service';
import { SwipeScrollDirective } from '../../../utils/swipe.directive';

@Component({
  selector: 'app-my-ressources',
  imports: [
    CommonModule,
    MatIconModule,
    BigRessourceCardComponent,
    RouterModule,
    SwipeScrollDirective
  ],
  templateUrl: './my-ressources.component.html',
  styleUrl: './my-ressources.component.scss'
})
export class MyRessourcesComponent implements OnInit {
  isMobile: boolean = false;

  draftRessources: any[] = [];
  waitingRessources: any[] = [];
  rejectedRessources: any[] = [];
  publishedRessources: any[] = [];

  constructor(
    private breakpointService: BreakpointService,
    private ressourceService: Ressourceservice
  ) {
    this.isMobile = this.breakpointService.isMobile();
    this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  ngOnInit(): void {
    this.ressourceService.getFilterRessources(6).subscribe((res) => {
      this.draftRessources = res.ressources.map((ressource) => ({
        id: ressource.id,
        title: ressource.title,
        imageUrl:
          ressource.content_link ||
          'https://picsum.photos/300/200?random=' + ressource.id,
        user: {
          name: ressource.creator.username,
          avatarUrl: 'https://i.pravatar.cc/40?u=' + ressource.creator.id,
        },
        likes: ressource.likeCount,
        comments: ressource.commentCount,
      }));
    });
  }
}
