import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './../api.service';
import { DeletedResponse } from '../api-response.model';
import {
    SingleRessourceResponse, 
    MultipleRessourceResponse, 
    CreateRessourceRequest, 
    UpdateRessourceRequest,
} from './ressource.model';

@Injectable({
  providedIn: 'root',
})
export class RessourceService {
  private readonly endpoint = '/ressources';

  constructor(private api: ApiService) {}

  getAll(): Observable<MultipleRessourceResponse> {
    return this.api.get<MultipleRessourceResponse>(this.endpoint);
  }

//   query
// string
// (query)
	

// Le champ de recherche
// categoryId
// string
// (query)
	

// L'id de la catégorie recherchée
// type
// string
// (query)
	

// Type recherché
// creatorId
// string
// (query)
	

// L'id de l'utilisateur qui a créé la ressource
// validatorId
// string
// (query)
	

// L'id de l'utilisateur qui a validé la ressource
// status
// number
// (query)
	

// Statut de la ressource
// page *
// number
// (query)
	

// Le numéro de la page
// pageSize *
// number
// (query)
	

// Le nombre de ressources par page
  getFilterPublic(): Observable<MultipleRessourceResponse> {
    return this.api.get<MultipleRessourceResponse>(`${this.endpoint}/filterpublic`);
  }

  getById(id: number): Observable<SingleRessourceResponse> {
    return this.api.get<SingleRessourceResponse>(`${this.endpoint}/${id}`);
  }

  create(category: CreateRessourceRequest): Observable<SingleRessourceResponse> {
    return this.api.post<SingleRessourceResponse>(this.endpoint, category);
  }

  update(id: number, category: UpdateRessourceRequest): Observable<SingleRessourceResponse> {
    return this.api.put<SingleRessourceResponse>(`${this.endpoint}/${id}`, category);
  }

  delete(id: number): Observable<DeletedResponse> {
    return this.api.delete<DeletedResponse>(`${this.endpoint}/${id}`);
  }
}
