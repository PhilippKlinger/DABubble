import { Component, ElementRef, ViewChild } from '@angular/core';
import { Channel } from 'src/app/models/channel.class';
import { User } from 'src/app/models/user.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { UserService } from 'src/app/shared-services/user.service';
import { MessagesService } from 'src/app/shared-services/messages.service';
import { DataService } from 'src/app/shared-services/data.service';

@Component({
  selector: 'app-main-content-new-message',
  templateUrl: './main-content-new-message.component.html',
  styleUrls: ['./main-content-new-message.component.scss']
})
export class MainContentNewMessageComponent {
  emoji_window_open: boolean = false;
  @ViewChild('message') input_message!: ElementRef;

  searchQuery: string = '';
  foundChannels: Channel[] = [];
  foundUsers: User[] = [];
  foundEmails: User[] = [];

  constructor(
    private channelsService: ChannelsService,
    private userService: UserService,
    private dataService: DataService,
    private messagesService: MessagesService
  ) { }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
    if (this.searchQuery) {
      this.channelsService.refreshMessagesInAccessibleChannels();
      this.searchChannelsAndUsers();
    } else {
      this.clearSearchResults();
    }
  }

  searchChannelsAndUsers() {
    this.foundChannels = [];
    this.foundUsers = [];
    this.foundEmails = [];
  
    if (!this.searchQuery) {
      return;
    }
  
    const firstChar = this.searchQuery.charAt(0);
    const searchQueryLower = this.searchQuery.toLowerCase().slice(1); // Entfernen des ersten Zeichens für die Suche
 
    if (firstChar === '#') {
      this.channelsService.channels$.subscribe(channels => {
        this.foundChannels = channels.filter(channel =>
          channel.name.toLowerCase().includes(searchQueryLower)
        );
      });
    } else if (firstChar === '@') {
      this.userService.users$.subscribe(users => {
        this.foundUsers = users.filter(user =>
          user.name.toLowerCase().includes(searchQueryLower)
        );
      });
    } else {
      this.userService.users$.subscribe(users => {
        this.foundEmails = users.filter(user =>
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    }
  }
  
  clearSearchResults() {
    this.foundChannels = [];
    this.foundUsers = [];
    this.foundEmails = [];
  }

  openChannel(channel: Channel): void {
    if (this.channelsService.isCurrentUserChannelMember(channel)) {
      if (this.dataService.directmessage_open$) {
        this.dataService.directmessage_open$.next(false);
      }
      let counter = 0;
      const intervalId = setInterval(() => {
        this.channelsService.setSelectedChannel(channel);
        this.dataService.thread_open$.next(false);
        this.dataService.new_message_open$.next(false);
        counter++;
        if (counter === 5) {
          clearInterval(intervalId);
        }
      }, 100);
    }
    this.clearSearchQuery();
  }

  openDM(user: User) {
    this.dataService.directmessage_open$.next(true);
    this.dataService.thread_open$.next(false);
    this.dataService.new_message_open$.next(false);
    this.messagesService.dm_user$.next(user);
    this.clearSearchQuery();
  }

  clearSearchQuery() {
    this.searchQuery = '';
    this.clearSearchResults();
  }

  addEmoji($event: any) {
    if ($event.emoji.native !== '🫥') {
      this.input_message.nativeElement.value += $event.emoji.native;
      //console.log($event.emoji);
      this.emoji_window_open = false;
    }
  }

  toggleEmojiWindow() {
    this.emoji_window_open = !this.emoji_window_open;
  }
}
