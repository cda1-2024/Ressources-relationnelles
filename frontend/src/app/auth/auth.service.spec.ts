import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { take } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

describe('AuthService HTTP Tests', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    localStorage.clear();
    sessionStorage.clear();

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('1. Non connecté au lancement', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('2. Se connecte et stocke le token dans localStorage', (done) => {
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyMzZkM2MzLTU4NDgtNDkwNS1hY2ZkLTlhZjg0ODgxY2EzMCIsInVzZXJuYW1lIjoiVGVzdGV1cl9uMSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ3MjE1MTMwLCJleHAiOjE3NDcyMTg3MzB9.6LzYX7JOA2LjKghCpWLA_U7rEngC7mLVJXau5vNNB7E';
    const mockResponse = { accessToken: mockToken };

    service.login('user@example.com', 'pass', true)
      .pipe(take(1))
      .subscribe(() => {
        expect(localStorage.getItem('auth_token')).toBe(mockToken);
        expect(service.isLoggedIn()).toBeTrue();
        done();
      });

    const expectedUrl = `${apiUrl}/auth/login`;
    const req = httpMock.expectOne(expectedUrl, 'Request to login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ identifier: 'user@example.com', password: 'pass' });
    req.flush(mockResponse);
  });

  it('3. Se connecte et stocke le token dans sessionStorage', (done) => {
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyMzZkM2MzLTU4NDgtNDkwNS1hY2ZkLTlhZjg0ODgxY2EzMCIsInVzZXJuYW1lIjoiVGVzdGV1cl9uMSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ3MjE1MTMwLCJleHAiOjE3NDcyMTg3MzB9.6LzYX7JOA2LjKghCpWLA_U7rEngC7mLVJXau5vNNB7E';
    const mockResponse = { accessToken: mockToken };

    service.login('user@example.com', 'pass', false)
      .pipe(take(1))
      .subscribe(() => {
        expect(sessionStorage.getItem('auth_token')).toBe(mockToken);
        expect(service.isLoggedIn()).toBeTrue();
        done();
      });

    const expectedUrl = `${apiUrl}/auth/login`; 
    const req = httpMock.expectOne(expectedUrl, 'Request to login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ identifier: 'user@example.com', password: 'pass' });
    req.flush(mockResponse);
  });

  it('4. Échec de connexion avec mauvais identifiants', (done) => {
    const mockErrorResponse = {
      status: 'error',
      message: 'Le mot de passe ou identifiant sont incorrect',
      statusCode: 401,
    };

    service.login('wrong@example.com', 'wrong', true)
      .pipe(take(1))
      .subscribe({
        next: () => fail('Le login aurait dû échouer'),
        error: (error) => {
          expect(service.isLoggedIn()).toBeFalse();
          expect(localStorage.getItem('auth_token')).toBeNull();
          expect(error.status).toBe(401);
          expect(error.error).toEqual(mockErrorResponse); 
          done();
        },
      });

    const expectedUrl = `${apiUrl}/auth/login`; 
    const req = httpMock.expectOne(expectedUrl, 'Request to login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ identifier: 'wrong@example.com', password: 'wrong' });
    req.flush(
      mockErrorResponse,
      {
        status: 401,
        statusText: 'Unauthorized',
      }
    );
  });

  it('5. Se déconnecte et vide les infos dans les storages', () => {
    localStorage.setItem('auth_token', 'token');
    sessionStorage.setItem('auth_token', 'token');
    service.logout();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(sessionStorage.getItem('auth_token')).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('6. S\'enregistre et stocke le token dans localStorage', (done) => {
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRmZmM4YWYxLTQzMjEtNDM5OC1iNjkxLTQzNzQxYjY5YjRkMiIsInVzZXJuYW1lIjoiN291bm91Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDcyMTU3NjQsImV4cCI6MTc0NzIxOTM2NH0.4fKXV8nK9E70f92c70eJq-OypXm2L9r_s4_J754Yf1o';
    const mockResponse = { accessToken: mockToken };
    const mockRegisterPayload = { email: 'new.user@example.com', username: 'newuser', password: 'newpassword' };

    service.register(mockRegisterPayload.email, mockRegisterPayload.username, mockRegisterPayload.password, true)
      .pipe(take(1))
      .subscribe(() => {
        expect(localStorage.getItem('auth_token')).toBe(mockToken);
        expect(service.isLoggedIn()).toBeTrue();
        done();
      });

    const expectedUrl = `${apiUrl}/auth/register`;
    const req = httpMock.expectOne(expectedUrl, 'Request to register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterPayload);
    req.flush(mockResponse);
  });

  it('7. S\'enregistre et stocke le token dans sessionStorage', (done) => {
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRmZmM4YWYxLTQzMjEtNDM5OC1iNjkxLTQzNzQxYjY5YjRkMiIsInVzZXJuYW1lIjoiN291bm91Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDcyMTU3NjQsImV4cCI6MTc0NzIxOTM2NH0.4fKXV8nK9E70f92c70eJq-OypXm2L9r_s4_J754Yf1o';
    const mockResponse = { accessToken: mockToken };
    const mockRegisterPayload = { email: 'another.user@example.com', username: 'anotheruser', password: 'anotherpassword' };

    service.register(mockRegisterPayload.email, mockRegisterPayload.username, mockRegisterPayload.password, false)
      .pipe(take(1))
      .subscribe(() => {
        expect(sessionStorage.getItem('auth_token')).toBe(mockToken);
        expect(service.isLoggedIn()).toBeTrue();
        done();
      });

    const expectedUrl = `${apiUrl}/auth/register`;
    const req = httpMock.expectOne(expectedUrl, 'Request to register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterPayload);
    req.flush(mockResponse);
  });

  it('8. Échec de l\'enregistrement (par exemple, email déjà utilisé)', (done) => {
    const mockErrorResponse = {
      status: 'error',
      message: 'Cet email est déjà utilisé',
      statusCode: 409,
    };
    const mockRegisterPayload = { email: 'existing@example.com', username: 'existinguser', password: 'password' };

    service.register(mockRegisterPayload.email, mockRegisterPayload.username, mockRegisterPayload.password, true)
      .pipe(take(1))
      .subscribe({
        next: () => fail('L\'enregistrement aurait dû échouer'),
        error: (error) => {
          expect(service.isLoggedIn()).toBeFalse();
          expect(localStorage.getItem('auth_token')).toBeNull();
          expect(error.status).toBe(409);
          expect(error.error).toEqual(mockErrorResponse);
          done();
        },
      });

    const expectedUrl = `${apiUrl}/auth/register`;
    const req = httpMock.expectOne(expectedUrl, 'Request to register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterPayload);
    req.flush(
      mockErrorResponse,
      {
        status: 409,
        statusText: 'Conflict',
      }
    );
  });
  
});