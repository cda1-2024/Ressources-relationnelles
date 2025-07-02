import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../../components/modal/login_modal/login_modal.component';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointService } from '../../../services/breackpoint.service';
import { NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './../../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatSidenavModule,
    NgIf,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isMobile: boolean = false;
  isLoggedIn: boolean = false;
  userId: string | null = null;
  username: string | null = null;

  constructor(
    private breakpointService: BreakpointService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.isMobile = this.breakpointService.isMobile();
    this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });

    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.userId$.subscribe((userId) => {
      this.userId = userId;
    });

    this.authService.username$.subscribe((username) => {
      this.username = username;
    });
  }

  openLoginDialog(): void {
    this.dialog.open(LoginComponent, {
      width: '400px',
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
