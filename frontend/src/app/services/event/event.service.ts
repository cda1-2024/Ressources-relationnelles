import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventResponse, EventListResponse, FullEventResponse } from './event.model';
import { ApiService } from '../api.service';
import { CreateEventRequest } from './event.request';


@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private api: ApiService) {}

  createEvent(createEventRequest: CreateEventRequest): Observable<EventResponse> {
    return this.api.post<EventResponse>('/events/', createEventRequest);
  }

  participateEvent(id: string): Observable<EventResponse> {
    return this.api.post<EventResponse>('/events/participate/' + id, {});
  }

  getFilterEvents(number: number): Observable<EventListResponse> {
    return this.api.get<EventListResponse>('/events/filter?pageSize=' + number);
  }

  getAllEvents(): Observable<EventListResponse> {
    return this.api.get<EventListResponse>('/events/');
  }

  getEventById(id: string): Observable<FullEventResponse> {
    return this.api.get<FullEventResponse>('/events/' + id);
  }

  suspendEvent(id: string): Observable<EventResponse> {
    return this.api.put<EventResponse>('/events/myPassword' + id, {});
  }

  deleteEvent(userId: string): Observable<EventResponse> {
    return this.api.delete<EventResponse>('/events/' + userId);
  }
}
