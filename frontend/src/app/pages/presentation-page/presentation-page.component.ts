import { Component } from '@angular/core';
// Import module card angular
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { NgIf } from '@angular/common';
import { BreakpointService } from '../../services/breackpoint.service';


@Component({
  selector: 'app-presentation-page',
  imports: [
    MatButtonModule,
    NgIf
  ],
  templateUrl: './presentation-page.component.html',
  styleUrl: './presentation-page.component.scss'
})
export class PresentationPageComponent {
  isMobile: boolean = false;

  constructor(private breakpointService: BreakpointService) {
    this.isMobile = this.breakpointService.isMobile();
    this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }
}
