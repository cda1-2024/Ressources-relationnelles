import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserFull } from '../../models/user.model';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private api: ApiService) {}

  getUser(userId: string): Observable<User> {
    return this.api.get<User>('/auth/user/' + userId)
  }
}
