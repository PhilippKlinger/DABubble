import { Component } from '@angular/core';
import { Channel } from 'src/app/models/channel.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { User } from 'src/app/models/user.class';
import { UserService } from 'src/app/shared-services/user.service';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { Message } from 'src/app/models/message.class';
import { DataService } from 'src/app/shared-services/data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-main-content-searchbar',
  templateUrl: './main-content-searchbar.component.html',
  styleUrls: ['./main-content-searchbar.component.scss']
})
export class MainContentSearchbarComponent {

  placeholder: string = 'Code learning durchsuchen'
  searchQuery: string = '';
  foundChannels: Channel[] = [];
  foundUsers: User[] = [];
  foundMessages: Message[] = [];
  isGuestUser!: boolean;
  private destroyed$ = new Subject<void>();
  
  constructor(
    private channelsService: ChannelsService,
    private userService: UserService,
    private dialogService: OpenDialogService,
    private dataService: DataService) {
    dataService.mobile$.subscribe((value: boolean) => {
      if (value) {
        this.placeholder = 'Gehe zu...'
      } else {
        this.placeholder = 'Code learning durchsuchen'
      }
    });
    this.userService.isGuestUser$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(isGuestUser => {
      this.isGuestUser = isGuestUser;
    });
  }

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
    if (!this.searchQuery) {
      this.clearSearchResults();
      return;
    }

    const searchQueryLower = this.searchQuery.toLowerCase();

    this.channelsService.channels$.subscribe(channels => {
      this.foundChannels = channels.filter(channel =>
        channel.name.toLowerCase().includes(searchQueryLower)
      );
    });

    if (this.isGuestUser) {
      this.userService.users$.subscribe(users => {
        this.foundUsers = users.filter(user => 
          user.id === this.userService.guestId &&
          user.name.toLowerCase().includes(searchQueryLower));
      });
    } else {
      this.userService.users$.subscribe(users => {
        this.foundUsers = users.filter(user => 
          user.name.toLowerCase().includes(searchQueryLower));
      });
    }

    this.channelsService.messagesInChannels$.subscribe(messages => {
      this.foundMessages = messages.filter(message =>
        message.message.toLowerCase().includes(searchQueryLower)
      );
    });
  }

  clearSearchResults() {
    this.foundChannels = [];
    this.foundUsers = [];
    this.foundMessages = [];
  }

  showSelectedUser(user: User) {
    this.userService.setSelectedUser(user);
    this.dialogService.openDialog('showProfile');
    this.clearSearchQuery();
  }

  openChannelOrMessage(item: Channel | Message): void {

    if (item instanceof Channel && this.channelsService.isCurrentUserChannelMember(item)) {
      let counter = 0;
      const intervalId = setInterval(() => {
        this.channelsService.setSelectedChannel(item);
        this.dataService.thread_open$.next(false);
        this.dataService.new_message_open$.next(false);
        this.dataService.directmessage_open$.next(false);
        this.dataService.mainchat_mobile_open$.next(true);
        this.dataService.workspace_header_open$.next(true);
        counter++;
        if (counter === 5) {
          clearInterval(intervalId);
        }
      }, 100);
    } else {
      const channel = this.channelsService.getChannelToFindMessage(item.id);
      if (channel && this.channelsService.isCurrentUserChannelMember(channel)) {
        let counter = 0;
        const intervalId = setInterval(() => {
          this.channelsService.setSelectedChannel(channel);
          this.dataService.thread_open$.next(false);
          this.dataService.new_message_open$.next(false);
          this.dataService.directmessage_open$.next(false);
          counter++;
          if (counter === 5) {
            clearInterval(intervalId);
          }
        }, 100);
      }
    }
    this.clearSearchQuery();
  }

  clearSearchQuery() {
    this.searchQuery = '';
    this.clearSearchResults();
  }

  highlightMatch(text: string, searchQuery: string): string {
    if (!searchQuery) {
      return text;
    }
    const re = new RegExp(searchQuery, 'gi');
    return text.replace(re, match => `<mark>${match}</mark>`);
  }
  
}
