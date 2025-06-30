import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RessourceResponse, RessourceListResponse, FilterRessourceRequest } from './ressource.model';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root',
})
export class Ressourceservice {
  constructor(private api: ApiService) {}

  getFilterRessources(number: number): Observable<RessourceListResponse> {
    return this.api.get<RessourceListResponse>('/ressources/filterPublic?pageSize=' + number);
  }

  getAllRessources(): Observable<RessourceListResponse> {
    return this.api.get<RessourceListResponse>('/ressources/');
  }

  getRessourceById(id: string): Observable<RessourceResponse> {
    return this.api.get<RessourceResponse>('/ressources/' + id);
  }

  deleteUser(id: string): Observable<RessourceResponse> {
    return this.api.delete<RessourceResponse>('/ressources/' + id);
  }

  // Récupérer les ressources filtrées (publiques uniquement)
  getFilteredPublicRessources(filters: FilterRessourceRequest): Observable<RessourceListResponse> {
    const params = this.buildFilterParams(filters);
    return this.api.get<RessourceListResponse>(`/ressources/filterpublic${params}`);
  }

  // Récupérer les ressources filtrées (publiques et restreintes - nécessite une authentification)
  getFilteredRessources(filters: FilterRessourceRequest): Observable<RessourceListResponse> {
    const params = this.buildFilterParams(filters);
    return this.api.get<RessourceListResponse>(`/ressources/filter${params}`);
  }

  private buildFilterParams(filters: FilterRessourceRequest): string {
    const params = new URLSearchParams();
    
    if (filters.query) {
      params.append('query', filters.query);
    }
    if (filters.categoryId) {
      params.append('categoryId', filters.categoryId);
    }
    if (filters.type) {
      params.append('type', filters.type);
    }
    if (filters.creatorId) {
      params.append('creatorId', filters.creatorId);
    }
    if (filters.validatorId) {
      params.append('validatorId', filters.validatorId);
    }
    if (filters.status !== undefined) {
      params.append('status', filters.status.toString());
    }
    if (filters.page !== undefined) {
      params.append('page', filters.page.toString());
    }
    if (filters.pageSize !== undefined) {
      params.append('pageSize', filters.pageSize.toString());
    }

    const paramString = params.toString();
    return paramString ? `?${paramString}` : '';
  }
}
