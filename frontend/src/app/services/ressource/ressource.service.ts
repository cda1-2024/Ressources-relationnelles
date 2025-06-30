import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RessourceResponse, RessourceListResponse } from './ressource.model';
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
}
