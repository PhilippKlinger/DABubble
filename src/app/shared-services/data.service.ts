import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private thread_open: boolean = true;

  getBooleanValue(): boolean {
    return this.thread_open;
  }

  setBooleanValue(newValue: boolean) {
    this.thread_open = newValue;
  }
}
