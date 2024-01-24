import { Component } from '@angular/core';
import { Channel } from 'src/app/models/channel.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { User } from 'src/app/models/user.class';
import { UserService } from 'src/app/shared-services/user.service';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { Message } from 'src/app/models/message.class';
import { MessagesService } from 'src/app/shared-services/messages.service';


@Component({
  selector: 'app-main-content-searchbar',
  templateUrl: './main-content-searchbar.component.html',
  styleUrls: ['./main-content-searchbar.component.scss']
})
export class MainContentSearchbarComponent {

  searchQuery: string = '';
  foundChannels: Channel[] = [];
  foundUsers: User[] = [];
  foundMessages: Message[] = [];

  constructor(
    private channelsService: ChannelsService,
    private userService: UserService,
    private dialogService: OpenDialogService,
    private messagesService: MessagesService,) { }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement; // Casten des EventTargets als HTMLInputElement
    this.searchQuery = inputElement.value;
    this.channelsService.refreshMessagesInAccessibleChannels();
    this.searchChannelsAndUsers();
  }


  private searchChannelsAndUsers() {
    if (!this.searchQuery) {
      this.foundChannels = [];
      this.foundUsers = [];
      this.foundMessages = [];
      return;
    }

    // Durchsuchen der Channels
    this.channelsService.channels$.subscribe(channels => {
      this.foundChannels = channels.filter(channel =>
        channel.name.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        this.channelsService.isCurrentUserChannelMember(channel)
      );
    });

    // Durchsuchen der User
    this.userService.users$.subscribe(users => {
      this.foundUsers = users.filter(user => user.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    });

    // Durchsuchen der Nachrichten in den zugänglichen Channels
    this.channelsService.messagesInChannels$.subscribe(messages => {
      this.foundMessages = messages.filter(message =>
        message.message.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    });
  }

  showSelectedUser(user: User) {
    this.userService.setSelectedUser(user);
    this.dialogService.openDialog('showProfile');
  }

  openChannelOrMessage(item: Channel | Message): void {
    if (item instanceof Channel && this.channelsService.isCurrentUserChannelMember(item)) {
      this.channelsService.setSelectedChannel(item);
    } else if (item instanceof Message) {
      const channel = this.channelsService.getChannelForMessage(item.id);
      if (channel && this.channelsService.isCurrentUserChannelMember(channel)) {
        this.channelsService.setSelectedChannel(channel);
      }
    }
  }

}
