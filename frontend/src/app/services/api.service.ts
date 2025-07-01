import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

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
      httpParams = new HttpParams({
        fromObject:
          options?.params
            ?
              Object.keys(options.params).reduce((acc, key) => {
                const v = (options.params as { [key: string]: any })[key];
                if (v !== null && v !== undefined) {
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
    });
  }
}
