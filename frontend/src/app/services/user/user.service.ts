import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private api: ApiService) {}

  getUser(): Observable<User> {
    return this.api.get<User>('/users/me');
  }

  updateProfile(username: string, bio: string): Observable<User> {
    return this.api.put<User>('/users/myAccount', {username, bio});
  }

  updatePassword(oldPassword: string, newPassword: string): Observable<User> {
    return this.api.put<User>('/users/myPassword', {oldPassword, newPassword});
  }

  deleteUser(userId: string): Observable<User> {
    return this.api.delete<User>('/users/' + userId);
  }
}
