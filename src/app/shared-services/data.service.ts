import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public thread_open$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public directmessage_open$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public new_message_open$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public mobile$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public workspace_header_open$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public mainchat_mobile_open$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public threadchat_mobile_open$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public update_sidebar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    this.checkScreenSize();
    this.checkScreenResize();
  }

  checkScreenSize() {
    const bildBreite = window.innerWidth;
    if (bildBreite <= 1000) {
      this.mobile$.next(true);
    }
  }

  checkScreenResize() {
    window.addEventListener('resize', () => {
      const bildBreite = window.innerWidth;
      if (bildBreite <= 1000) {
        this.mobile$.next(true);
      } else {
        this.mobile$.next(false);
      }
    });
  }
}
