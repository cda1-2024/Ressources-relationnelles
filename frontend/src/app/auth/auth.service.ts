// auth/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginPayload, User } from './auth.model';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userId = new BehaviorSubject<string | null>(null);
  private username = new BehaviorSubject<string | null>(null);

  isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();
  userId$: Observable<string | null> = this.userId.asObservable();
  username$: Observable<string | null> = this.username.asObservable();

  constructor(
    private api: ApiService
  ) {
    this.refreshUserInfo();
  }

  login(email: string, password: string, rememberMe: boolean): Observable<void> {
    const payload: LoginPayload = {
      identifier: email,
      password,
      rememberMe,
    };
    return this.api.post<void>('/auth/login', payload).pipe(
      tap(() => {
        this.refreshUserInfo();
      })
    );
  }

  register(email: string, username: string, password: string, rememberMe: boolean): Observable<void> {
    const payload = { email, username, password, rememberMe };
    return this.api.post<void>('/auth/register', payload).pipe(
      tap(() => {
        this.refreshUserInfo();
      })
    );
  }

  refreshUserInfo(): void {
    this.api.get<User>('/users/me').subscribe({
      next: (user) => {
        this.loggedIn.next(true);
        this.userId.next(user.id);
        this.username.next(user.username);
      },
      error: (error) => {
        if(error.status === 401 || error.status === 403) {
          this.loggedIn.next(false);
          this.userId.next(null);
          this.username.next(null);
        }
      },
    });
  }

  logout(): void {
    this.api.post<void>('/auth/logout', {}).subscribe(() => {
      this.loggedIn.next(false);
      this.userId.next(null);
      this.username.next(null);
    });
  }

  refreshToken(): Observable<void> {
    return this.api.post<void>('/auth/refresh', {});
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }
}

