import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DataService } from 'src/app/shared-services/data.service';
import { Message } from './../../../models/message.class'
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Subscription } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { Reaction } from 'src/app/models/reaction.class';

@Component({
  selector: 'app-main-content-main-chat-lower-part',
  templateUrl: './main-content-main-chat-lower-part.component.html',
  styleUrls: ['./main-content-main-chat-lower-part.component.scss']
})
export class MainContentMainChatLowerPartComponent {
  @ViewChild('message') input_message!: ElementRef;
  @ViewChild('chat_content') chat_content!: ElementRef;
  message = new Message();
  reaction = new Reaction();
  selectedChannel!: Channel | null;
  unsubChannels!: Subscription;
  chatMessages: any = [];
  emoji_window_open: boolean = false;
  emoji_window_messages_open: boolean = false;

  constructor(private dataService: DataService, private channelService: ChannelsService) {
    this.unsubChannels = this.channelService.selectedChannel$.subscribe(selectedChannel => {
      if (selectedChannel) {
        this.selectedChannel = selectedChannel;
        this.receiveChatMessages();
      } else {
        console.log('waiting for selected channel');
      }
    });

    this.channelService.selectedMessageMainChat$.subscribe(selectedMessageMainChat => {
      console.log(selectedMessageMainChat);
    });
  }

  @HostListener('document:click', ['$event'])
  documentClickHandler(event: MouseEvent): void {
    if (this.emoji_window_messages_open && !this.isClickInsideContainer(event)) {
      this.emoji_window_messages_open = false;
    }
  }

  private isClickInsideContainer(event: MouseEvent): boolean {
    let containerElement = document.getElementById('emoji-window-messages');

    if (containerElement) {
      return containerElement.contains(event.target as Node);
    }

    return false;
  }

  addReaction($event: any) {
    this.reaction.setReaction($event.emoji.native);
    this.reaction.setCreator();
    this.channelService.addReactionToMessage(this.reaction);
    this.emoji_window_messages_open = false;
  }

  addEmoji($event: any) {
    if ($event.emoji.native !== '🫥') {
      this.input_message.nativeElement.value += $event.emoji.native;
      //console.log($event.emoji);
      this.emoji_window_open = false;
    }
  }

  toggleEmojiWindowForMessage(index: number) {
    setTimeout(() => {
      this.emoji_window_messages_open = !this.emoji_window_messages_open;
    }, 50);
    this.channelService.selectedMessageMainChat$.next(this.chatMessages[index]);
  }

  toggleEmojiWindow() {
    this.emoji_window_open = !this.emoji_window_open;
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
