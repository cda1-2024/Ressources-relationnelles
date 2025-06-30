export interface EventListResponse {
  events: EventResponse[];
  pageNumber: number;
  pageSize: number;
  totalNumberEvents: number;
  totalPages: number;
}

export interface EventResponse {
  id: string;
  title: string;
  manager: User;
  type: EventTypeDto;
}

export interface FullEventResponse {
  id: string;
  title: string;
  content: string;
  isRestricted: boolean;
  deleted: boolean;
  suspended: boolean;
  manager: User;
  type: EventTypeDto;
}

export interface User {
  id: string;
  username: string;
}

export interface EventTypeDto {
  id: number;
  label: string;
}



