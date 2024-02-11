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
  foundChannels: Channel[] = [];
  foundUsers: User[] = [];
  foundMessages: Message[] = [];
  placeholder: string = 'Code learning durchsuchen'
  searchQuery: string = '';
  isGuestUser!: boolean;
  mobile: boolean = false;
  private destroyed$ = new Subject<void>();

  constructor(
    private channelsService: ChannelsService,
    private userService: UserService,
    private dialogService: OpenDialogService,
    private dataService: DataService
  ) {
    dataService.mobile$.subscribe((value: boolean) => {
      this.mobile = value;
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
    const firstChar = this.searchQuery.charAt(0);
    const searchQueryLower = this.searchQuery.toLowerCase();
    const trimmedSearchQuery = searchQueryLower.slice(1);
    this.executeSearch(firstChar, trimmedSearchQuery, searchQueryLower)
    this.channelsService.messagesInChannels$.subscribe(messages => {
      this.foundMessages = messages.filter(message => message.message.toLowerCase().includes(searchQueryLower));
    });
  }

  searchUsers(query: string) {
    this.userService.users$.subscribe(users => {
      this.foundUsers = users.filter(user => {
        const isUserAllowed = this.isGuestUser ? user.id === this.userService.guestId : true;
        return isUserAllowed && user.name.toLowerCase().includes(query);
      });
    });
  }

  executeSearch(firstChar: string, trimmedSearchQuery: string, searchQueryLower: string) {
    if (firstChar === '#') {
      this.channelsService.channels$.subscribe(channels => {
        this.foundChannels = channels.filter(channel => channel.name.toLowerCase().includes(trimmedSearchQuery));
      });
      this.foundUsers = [];
    } else if (firstChar === '@') {
      this.searchUsers(trimmedSearchQuery);
      this.foundChannels = [];
    } else {
      this.channelsService.channels$.subscribe(channels => {
        this.foundChannels = channels.filter(channel => channel.name.toLowerCase().includes(searchQueryLower));
      });
      this.searchUsers(searchQueryLower);
    }
  }

  /**
   * this function clears the search
   */
  clearSearchResults() {
    this.foundChannels = [];
    this.foundUsers = [];
    this.foundMessages = [];
  }

  /**
   * this functions opens the profile of the selected user
   * @param user the selected user
   */
  showSelectedUser(user: User) {
    this.userService.setSelectedUser(user);
    this.dialogService.openDialog('showProfile');
    this.clearSearchQuery();
  }

  /**
   * this function navigates to the selected channel
   * @param item the channel
   */
  navigateToChannel(item: Channel) {
    if (this.mobile) {
      this.dataService.thread_open$.next(false);
      this.dataService.new_message_open$.next(false);
      this.dataService.directmessage_open$.next(false);
      this.dataService.mainchat_mobile_open$.next(true);
      this.dataService.workspace_header_open$.next(true);
    } else {
      this.dataService.directmessage_open$.next(false);
      this.dataService.thread_open$.next(false);
      this.dataService.new_message_open$.next(false);
    }
    let counter = 0;
    const intervalId = setInterval(() => {
      this.channelsService.setSelectedChannel(item);
      counter++;
      if (counter === 5) {
        clearInterval(intervalId);
      }
    }, 100);
  }

  /**
   * this function navigates to the selected message
   * @param channel the channel where the message is inside of
   */
  navigateToMessage(channel: Channel) {
    if (this.mobile) {
      this.dataService.thread_open$.next(false);
      this.dataService.new_message_open$.next(false);
      this.dataService.directmessage_open$.next(false);
      this.dataService.mainchat_mobile_open$.next(true);
      this.dataService.workspace_header_open$.next(true);
    } else {
      this.dataService.directmessage_open$.next(false);
      this.dataService.thread_open$.next(false);
      this.dataService.new_message_open$.next(false);
    }
    let counter = 0;
    const intervalId = setInterval(() => {
      this.channelsService.setSelectedChannel(channel);
      counter++;
      if (counter === 5) {
        clearInterval(intervalId);
      }
    }, 100);
  }

  /**
   * this function opens the selected message or channel
   * @param item 
   */
  openChannelOrMessage(item: Channel | Message): void {
    if (item instanceof Channel && this.channelsService.isCurrentUserChannelMember(item)) {
      this.navigateToChannel(item)
    } else {
      const channel = this.channelsService.getChannelToFindMessage(item.id);
      if (channel && this.channelsService.isCurrentUserChannelMember(channel)) {
        this.navigateToChannel(channel)
      }
    }
    this.clearSearchQuery();
  }

  /**
   * this function clears the search query
   */
  clearSearchQuery() {
    this.searchQuery = '';
    this.clearSearchResults();
  }

  /**
   * this function highlights the matching parts of the search result
   * @param text
   * @param searchQuery 
   * @returns 
   */
  highlightMatch(text: string, searchQuery: string): string {
    if (!searchQuery) {
      return text;
    }
    const effectiveSearchQuery = (searchQuery.charAt(0) === '#' || searchQuery.charAt(0) === '@') ? searchQuery.slice(1) : searchQuery;
    const re = new RegExp(effectiveSearchQuery, 'gi');
    return text.replace(re, match => `<mark>${match}</mark>`);
  }
}
