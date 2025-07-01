import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryResponse, CategoryListResponse } from './category.model';
import { ApiService } from '../api.service';
import { CreateCategoryRequest, FilterRequest as FilterRequest } from './category.request';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private api: ApiService) {}

  createCategory(createCategoryRequest: CreateCategoryRequest): Observable<CategoryResponse> {
    return this.api.post<CategoryResponse>('/categories', createCategoryRequest);
  }

  getFilterCategories(params: FilterRequest): Observable<CategoryListResponse> {
    return this.api.getWithParams<CategoryListResponse>('/categories/filter', {
      params,
    });
  }

  getAllCategories(): Observable<CategoryListResponse> {
    return this.api.get<CategoryListResponse>('/categories/');
  }

  getCategoryById(id: string): Observable<CategoryResponse> {
    return this.api.get<CategoryResponse>('/categories/' + id);
  }

  deleteUser(id: string): Observable<CategoryResponse> {
    return this.api.delete<CategoryResponse>('/categories/' + id);
  }
}
