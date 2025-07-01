import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { ReportResponse } from './report.model';


@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private api: ApiService) {}

  getReportByReportedId(id: string): Observable<ReportResponse[]> {
    return this.api.get<ReportResponse[]>('/reports/' + id);
  }

  reportUser(userId: string, reportData: { reportReason: string; content: string }): Observable<ReportResponse> {
    return this.api.post<ReportResponse>('/reports/' + userId, reportData);
  }
}
