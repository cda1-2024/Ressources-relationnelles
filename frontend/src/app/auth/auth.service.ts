// auth/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn$ = this.loggedIn.asObservable();

  // Mock users
  private mockUsers = [
    { email: 'admin@example.com', password: 'admin123', token: 'token-admin' },
    { email: 'user@example.com', password: 'user123', token: 'token-user' }
  ];

  // Check if token exists in localStorage or sessionStorage
  private hasToken(): boolean {
    try {
      return !!(typeof localStorage !== 'undefined' && localStorage.getItem(this.tokenKey)) ||
             !!(typeof sessionStorage !== 'undefined' && sessionStorage.getItem(this.tokenKey));
    } catch (e) {
      console.error('Storage is not available:', e);
      return false;
    }
  }

  // Log in the user
  login(email: string, password: string, rememberMe: boolean) {

    // TODO : Change this to a real API call
    const foundUser = this.mockUsers.find(
      user => user.email === email && user.password === password
    );

    return of(foundUser).pipe(
      delay(500),
      tap(user => {
        if (!user) {
          throw new Error('Identifiants invalides');
        }
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(this.tokenKey, user.token);
        this.loggedIn.next(true);
      })
    );
  }

  logout() {
    console.log('Déconnexion de l\'utilisateur');
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }
}