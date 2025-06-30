import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './../api.service';
import { SingleCategoryResponse, MultipleCategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from './category.model'; // Assure-toi que ce modèle existe ou adapte-le
import { DeletedResponse } from '../api-response.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly endpoint = '/categories';

  constructor(private api: ApiService) {}

  getAll(): Observable<MultipleCategoryResponse> {
    return this.api.get<MultipleCategoryResponse>(this.endpoint);
  }

  getById(id: number): Observable<SingleCategoryResponse> {
    return this.api.get<SingleCategoryResponse>(`${this.endpoint}/${id}`);
  }

  create(category: CreateCategoryRequest): Observable<SingleCategoryResponse> {
    return this.api.post<SingleCategoryResponse>(this.endpoint, category);
  }

  update(id: number, category: UpdateCategoryRequest): Observable<SingleCategoryResponse> {
    return this.api.put<SingleCategoryResponse>(`${this.endpoint}/${id}`, category);
  }

  delete(id: number): Observable<DeletedResponse> {
    return this.api.delete<DeletedResponse>(`${this.endpoint}/${id}`);
  }
}
