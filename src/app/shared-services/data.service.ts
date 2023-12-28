import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public thread_open: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  getBooleanValue(): boolean {
    return this.thread_open.value;
  }

  setBooleanValue(newValue: boolean) {
    this.thread_open.next(newValue);
  }
}
