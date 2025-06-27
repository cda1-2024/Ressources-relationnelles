export interface CreateEventRequest {
  title: string;
  content: string;
  type: number;
  isRestricted: boolean;
}