import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  private isMobileSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isMobile$: Observable<boolean> = this.isMobileSubject.asObservable();

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe(['(max-width: 814px)'])
      .subscribe((state: BreakpointState) => {
        this.isMobileSubject.next(state.matches);
      });
  }

  public isMobile(): boolean {
    return this.isMobileSubject.value;
  }
}