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
  selector: 'app-my-created-ressources',
  imports: [
    CommonModule,
    MatIconModule,
    RessourceCardComponent,
    RouterModule,
    SwipeScrollDirective
  ],
  templateUrl: './my-created-ressources.component.html',
  styleUrl: './my-created-ressources.component.scss'
})
export class MyCreatedRessourcesComponent implements OnInit {
  isMobile: boolean = false;

  draftRessources: RessourceResponse[] = [];
  waitingRessources: RessourceResponse[] = [];
  rejectedRessources: RessourceResponse[] = [];
  publishedRessources: RessourceResponse[] = [];

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
      this.draftRessources = res.ressources
    });
    this.ressourceService.getFilterRessources(6).subscribe((res) => {
      this.waitingRessources = res.ressources
    });
    this.ressourceService.getFilterRessources(6).subscribe((res) => {
      this.rejectedRessources = res.ressources
    });
    this.ressourceService.getFilterRessources(6).subscribe((res) => {
      this.publishedRessources = res.ressources
    });
  }
}
