import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from 'src/app/shared-services/data.service';
import { Message } from './../../../models/message.class'
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Subscription } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';

@Component({
  selector: 'app-main-content-main-chat-lower-part',
  templateUrl: './main-content-main-chat-lower-part.component.html',
  styleUrls: ['./main-content-main-chat-lower-part.component.scss']
})
export class MainContentMainChatLowerPartComponent {
  @ViewChild('message') input_message!: ElementRef;
  @ViewChild('chat_content') chat_content!: ElementRef;
  message = new Message();
  selectedChannel!: Channel | null;
  unsubChannels!: Subscription;
  chatMessages: any = [];

  constructor(private dataService: DataService, private channelService: ChannelsService) {
    this.unsubChannels = this.channelService.selectedChannel$.subscribe(selectedChannel => {
      if (selectedChannel) {
        this.selectedChannel = selectedChannel;
        this.receiveChatMessages();
      } else {
        console.log('waiting for selected channel');
      }
    });
  }

  selectMessageForThread(index: number) {
    this.channelService.thread_subject$.next(this.chatMessages[index]);
  }

  receiveChatMessages() {
    this.channelService.updateChatMessageOfSelectedChannel();
    this.chatMessages = this.channelService.chatMessages;
    // console.log(this.chatMessages);
  }

  openThread() {
    //setzt den thread_open boolean auf true.
    // Bei veränderung wird in Main-content.ts eine funktion ausgelöst da main content die function abonniert hat
    this.dataService.setBooleanValue(true);
  }

  sendMessageToChannel() {
    if (this.input_message.nativeElement.value.trim() !== '') {
      this.message.setCreator();
      this.message.setTimestampNow();
      this.message.setMessage(this.input_message.nativeElement.value.trim());
      this.channelService.pushMessageToChannel(this.message);
      this.input_message.nativeElement.value = '';
    }
  }

  ngOnDestroy() {
    this.unsubChannels.unsubscribe();
  }
}
