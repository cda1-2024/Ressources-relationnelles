// auth/auth.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { take } from 'rxjs';

describe('AuthService Tests', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    sessionStorage.clear();
    service = TestBed.inject(AuthService);
  });

  it('1. Non connecté au lancement', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('2. Se connecte avec bon login psw et stocke le token dans le local storage', (done) => {
    service.login('admin@example.com', 'admin123', true).pipe(take(1)).subscribe(() => {
      expect(service.isLoggedIn()).toBeTrue();
      expect(localStorage.getItem('auth_token')).toBe('token-admin');
      done();
    });
  });

  it('3. Se connecte avec bon login psw et stocke le token dans le session storage', (done) => {
    service.login('user@example.com', 'user123', false).pipe(take(1)).subscribe(() => {
      expect(service.isLoggedIn()).toBeTrue();
      expect(sessionStorage.getItem('auth_token')).toBe('token-user');
      done();
    });
  });

  it('4. Ne se connecte pas avec de mauvais identifiants', (done) => {
    service.login('wrong@example.com', 'wrong', true).pipe(take(1)).subscribe({
      next: () => fail('Le login aurait dû échouer'),
      error: () => {
        expect(service.isLoggedIn()).toBeFalse();
        expect(localStorage.getItem('auth_token')).toBeNull();
        done();
      }
    });
  });

  it('5. Se deconnecte et vide les infos dans les sessions', () => {
    localStorage.setItem('auth_token', 'abc');
    sessionStorage.setItem('auth_token', 'abc');
    service.logout();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(sessionStorage.getItem('auth_token')).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });
});
