import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/message.class';
import { ChannelsService } from './channels.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public thread_open$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public directmessage_open$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private channelService: ChannelsService) {
    this.channelService.selectedChannel$.subscribe(() => {
      this.thread_open$.next(false);
    });
  }

  getBooleanValue(): boolean {
    return this.thread_open$.value;
  }

  setBooleanValue(newValue: boolean) {
    this.thread_open$.next(newValue);
  }
}
