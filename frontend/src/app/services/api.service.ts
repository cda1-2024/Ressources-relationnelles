// core/services/api.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl; // Récupère l'URL de l'API depuis l'environnement

  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${url}`, { withCredentials: true });
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${url}`, body, {
      withCredentials: true,
    });
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${url}`, body, {
      withCredentials: true,
    });
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${url}`, {
      withCredentials: true,
    });
  }

  patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}${url}`, body, {
      withCredentials: true,
    });
  }

  getWithParams<T>(
    url: string,
    options?: {
      params?: { [key: string]: any } | HttpParams;
      withCredentials?: boolean;
    }
  ): Observable<T> {
    let httpParams: HttpParams;

    if (options?.params instanceof HttpParams) {
      httpParams = options.params;
    } else {
      // Crée un HttpParams à partir de l'objet littéral
      httpParams = new HttpParams({
        fromObject:
          options?.params
            ? // stringify automatiquement les valeurs (y compris tableaux)
              Object.keys(options.params).reduce((acc, key) => {
                const v = (options.params as { [key: string]: any })[key];
                // on ignore les valeurs null/undefined
                if (v !== null && v !== undefined) {
                  // si c’est un booléen ou un nombre on toString()
                  acc[key] = Array.isArray(v)
                    ? v.map(x => String(x))
                    : String(v);
                }
                return acc;
              }, {} as Record<string, string | string[]>)
            : {}
      });
    }

    return this.http.get<T>(`${this.apiUrl}${url}`, {
      withCredentials: options?.withCredentials ?? true,
      params: httpParams
    })
    .pipe(
      tap({
        next: res => console.log('← Réponse GET', `${this.apiUrl}${url}`, httpParams, res),
        error: err => console.error('← Erreur GET', `${this.apiUrl}${url}`,httpParams , err)
      })
    );
  }
}
