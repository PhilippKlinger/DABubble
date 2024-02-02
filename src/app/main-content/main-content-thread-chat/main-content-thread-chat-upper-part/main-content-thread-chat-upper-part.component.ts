import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { DataService } from 'src/app/shared-services/data.service';

@Component({
  selector: 'app-main-content-thread-chat-upper-part',
  templateUrl: './main-content-thread-chat-upper-part.component.html',
  styleUrls: ['./main-content-thread-chat-upper-part.component.scss']
})
export class MainContentThreadChatUpperPartComponent {
  selectedChannel!: Channel | null;
  unsubChannels!: Subscription;
  mobile: boolean = false;

  constructor(private dataService: DataService, private ChannelsService: ChannelsService) {
    this.unsubChannels = this.ChannelsService.selectedChannel$.subscribe(selectedChannel => {
      this.selectedChannel = selectedChannel;
    });

    this.dataService.mobile$.subscribe((value) => {
      this.mobile = value;
    })
  }

  closeThreadChat() {
    this.dataService.thread_open$.next(false);
    if (this.mobile) {
      this.dataService.threadchat_mobile_open$.next(false);
    }
  }
}
