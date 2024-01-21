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

  constructor(private dataService: DataService, private ChannelsService: ChannelsService) {
    this.unsubChannels = this.ChannelsService.selectedChannel$.subscribe(selectedChannel => {
      this.selectedChannel = selectedChannel;
      // console.log(this.selectedChannel)
    });
  }

  closeThreadChat() {
    //boolean wert wird in der data.service.ts geändert und bei veränderung wird eine funktion in main-content ausgelöst
    this.dataService.setBooleanValue(false);
  }
}
