import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { BreakpointService } from '../../services/breackpoint.service';

@Component({
  selector: 'app-navbar-mobile',
  imports: [
    MatToolbarModule,
    MatIconModule
  ],
  templateUrl: './navbar-mobile.component.html',
  styleUrl: './navbar-mobile.component.scss'
})
export class NavbarMobileComponent {
  isMobile: boolean = false;
  
    constructor(private breakpointService: BreakpointService) {
      this.isMobile = this.breakpointService.isMobile();
      this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
      });
    }
}
