import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse, UserListResponse, FullUserResponse } from './user.model';
import { ApiService } from '../api.service';
import { CreateUserRequest, FilterRequest } from './user.request';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private api: ApiService) {}

  createUser(createUserRequest: CreateUserRequest): Observable<UserResponse> {
    return this.api.post<UserResponse>('/users', createUserRequest);
  }

  getFilterUsers(params: FilterRequest): Observable<UserListResponse> {
    return this.api.getWithParams<UserListResponse>('/users', {
      params
    });
  }

  getAllUsers(): Observable<UserListResponse> {
    return this.api.get<UserListResponse>('/users/');
  }

  getUserById(id: string): Observable<FullUserResponse> {
    return this.api.get<FullUserResponse>('/users/' + id);
  }

  getUserByIdentifier(id: string): Observable<UserResponse> {
    return this.api.get<UserResponse>('/users/' + id);
  }

  getUser(): Observable<UserResponse> {
    return this.api.get<UserResponse>('/users/me');
  }

  updateProfile(username: string, bio: string): Observable<UserResponse> {
    return this.api.put<UserResponse>('/users/myAccount', {username, bio});
  }

  updatePassword(oldPassword: string, newPassword: string): Observable<UserResponse> {
    return this.api.put<UserResponse>('/users/myPassword', {oldPassword, newPassword});
  }

  deleteUser(userId: string): Observable<UserResponse> {
    return this.api.delete<UserResponse>('/users/' + userId);
  }
}
