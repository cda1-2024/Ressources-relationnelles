import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { ViewEncapsulation } from '@angular/core';
import { BreakpointService } from './services/breackpoint.service';
import { AuthService } from './auth/auth.service';
import { NgIf } from '@angular/common';
import { NavbarMobileComponent } from './navbar/navbar-mobile/navbar-mobile.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    NavbarMobileComponent,
    NgIf,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'angular-navigation-app';

  isMobile: boolean = false; // Variable pour détecter si c'est un mobile
  isLoggedIn: boolean = false; // Variable pour savoir si l'utilisateur est connecté

  constructor(
    private breakpointService: BreakpointService,
    private authService: AuthService
  ) {
    this.isMobile = this.breakpointService.isMobile();
    this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });

    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }
}
