// auth/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginPayload } from './auth.model';
import { ApiService } from '../services/api.service';
import { JwtHelperService } from '@auth0/angular-jwt'; // Un bundle bien pratique !


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';
  private jwtHelper = new JwtHelperService();
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private userId = new BehaviorSubject<string | null>(this.getUserId());
  private username = new BehaviorSubject<string | null>(this.getUsername());

  isLoggedIn$ : Observable<boolean> = this.loggedIn.asObservable();
  userId$: Observable<string | null> = this.userId.asObservable();
  username$: Observable<string | null> = this.username.asObservable();

  constructor(private api: ApiService) {}

  // Vérifie si le token est présent et valide
  private hasToken(): boolean {
    try {

      let token: string | null = this.getToken();

      if ( typeof token == 'undefined' || token == null || token == 'null' || token == 'undefined') {
        return false;
      }

      const isExpired = this.jwtHelper.isTokenExpired(token);
      if (isExpired) {
        localStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem(this.tokenKey);
        return false;
      }
      return true;

    } catch (e) {
      console.error('Storage is not available:', e);
      return false;
    }
  }

  // Contacte l'API pour se connecter
  // et stocke le token dans localStorage ou sessionStorage
  login(email: string, password: string, rememberMe: boolean): Observable<AuthResponse> {
    const payload: LoginPayload = {
      identifier: email,
      password,
    };

    return this.api.post<AuthResponse>('/auth/login', payload).pipe(
      tap((response) => {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(this.tokenKey, response.accessToken	);
        this.loggedIn.next(true);
        this.userId.next(this.getUserId());
        this.username.next(this.getUsername());
      })
    );
  }

  // Supprime le token de localStorage et sessionStorage
  logout() {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
    this.userId.next(null);
    this.username.next(null);
    
    this.loggedIn.next(false);
  }

  // Renvoie le token stocké
  getToken(): string | null {
    
    let token: string | null = null;
    if(typeof localStorage !== 'undefined'){     
      token = localStorage.getItem(this.tokenKey);       
    }
    
    if(typeof sessionStorage !== 'undefined' && token == null){
      token = sessionStorage.getItem(this.tokenKey);
    }
    return token;
  }

  // Renvoie si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  // Renvoie l'ID de l'utilisateur
  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.userId || null;
    }
    return null;
  }

  // Renvoie le nom d'utilisateur
  getUsername(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.username || null;
    }
    return null;
  }


  // Crée un nouvel utilisateur
  register(email: string, username: string, password: string, rememberMe: boolean): Observable<AuthResponse> {
    const payload = {
      email,
      username,
      password,
    };


    return this.api.post<AuthResponse>('/auth/register', payload).pipe(
      tap((response) => {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(this.tokenKey, response.accessToken	);
        this.loggedIn.next(true);
        this.userId.next(this.getUserId());
        this.username.next(this.getUsername());
      })
    );
  }

}
