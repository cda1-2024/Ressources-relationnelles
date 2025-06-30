import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse, UserListResponse } from './user.model';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private api: ApiService) {}

  getFilterUsers(number: number, disabled: boolean): Observable<UserListResponse> {
    return this.api.get<UserListResponse>('/users?pageSize=' + number + '&disabled=' + disabled);
  }

  getAllUsers(): Observable<UserListResponse> {
    return this.api.get<UserListResponse>('/users/');
  }

  getUserById(id: string): Observable<UserResponse> {
    return this.api.get<UserResponse>('/users/' + id);
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
