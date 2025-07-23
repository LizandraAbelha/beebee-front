import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private toggleSubject = new Subject<void>();

  toggle$ = this.toggleSubject.asObservable();

  toggle(): void {
    this.toggleSubject.next();
  }
}
