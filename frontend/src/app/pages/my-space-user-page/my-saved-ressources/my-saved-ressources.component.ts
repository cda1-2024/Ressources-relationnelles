import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BreakpointService } from '../../../services/breackpoint.service';
import { Ressourceservice } from '../../../services/ressource/ressource.service';
import { SwipeScrollDirective } from '../../../utils/swipe.directive';
import { RessourceResponse } from '../../../services/ressource/ressource.model';
import { RessourceCardComponent } from '../../../components/card/ressource-card/ressource-card.component';

@Component({
  selector: 'app-my-saved-ressources',
  imports: [
    CommonModule,
    MatIconModule,
    RessourceCardComponent,
    RouterModule,
    SwipeScrollDirective
  ],
  templateUrl: './my-saved-ressources.component.html',
  styleUrl: './my-saved-ressources.component.scss'
})
export class MySavedRessourcesComponent implements OnInit {
  isMobile: boolean = false;

  favoriteRessources: RessourceResponse[] = [];
  toLaterRessources: RessourceResponse[] = [];
  likedRessources: RessourceResponse[] = [];

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
      this.favoriteRessources = res.ressources
    });
    this.ressourceService.getFilterRessources(6).subscribe((res) => {
      this.toLaterRessources = res.ressources
    });
    this.ressourceService.getFilterRessources(6).subscribe((res) => {
      this.likedRessources = res.ressources
    });
  }
}
