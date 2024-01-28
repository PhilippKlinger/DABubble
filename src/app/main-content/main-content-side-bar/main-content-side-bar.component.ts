import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { User } from 'src/app/models/user.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { DataService } from 'src/app/shared-services/data.service';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/shared-services/user.service';
import { MessagesService } from 'src/app/shared-services/messages.service';
@Component({
  selector: 'app-main-content-side-bar',
  templateUrl: './main-content-side-bar.component.html',
  styleUrls: ['./main-content-side-bar.component.scss']
})
export class MainContentSideBarComponent {
  channel_icon: string = 'arrow_drop_down';
  channels_opened: boolean = true;
  directmessage_icon: string = 'arrow_drop_down';
  directmessages_opened: boolean = true;

  channels: Channel[] = [];
  unsubChannels!: Subscription;
  currentUser!: User;
  users: any[] = [];

  constructor(private dialogService: OpenDialogService,
    private channelsService: ChannelsService,
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private messageService: MessagesService) {

    this.channelsService.currentUserInfo$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });

    this.unsubChannels = this.channelsService.channels$.subscribe(channels => {
      this.channels = channels;
      this.sortChannels();
      this.channelsService.selectedChannel$.next(channels[0]);
    });

    this.userService.users$.subscribe((users) => {
      this.users = users;
    })
  }

  openNewMessageInput() {
    this.dataService.new_message_open$.next(true);
    this.dataService.thread_open$.next(false);
    this.dataService.directmessage_open$.next(false);
  }

  sortChannels() {
    this.channels.sort((a: any, b: any) => {
      const timeA = this.parseDate(a.timestamp);
      const timeB = this.parseDate(b.timestamp);
      return timeB - timeA;
    });
  }

  parseDate(timestamp: any) {
    const dateParts = timestamp.split(' ')[0].split('-');
    const timeParts = timestamp.split(' ')[1].split(':');

    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Monate in JavaScript sind 0-basiert
    const day = parseInt(dateParts[0], 10);
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    return new Date(year, month, day, hours, minutes).getTime();
  }

  openDM(user: User) {
    this.dataService.directmessage_open$.next(true);
    this.dataService.thread_open$.next(false);
    this.dataService.new_message_open$.next(false);
    this.messageService.dm_user$.next(user);
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
          clearInterval(intervalId); // Stoppt das Intervall, nachdem es dreimal aufgerufen wurde
        }
      }, 100);
    } else {
      this.showNotAMemberPopup();

    }

  }

  showNotAMemberPopup(): void {
    let snackbarRef = this.snackBar.open('Sie sind kein Mitglied dieses Channels.', 'Schließen', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });

    // snackbarRef.afterDismissed().subscribe(() => {
    //   this.dataService.directmessage_open$.next(true);
    // });
  }



  openDialog(componentKey: string): void {
    this.dialogService.setNeedToAddMoreMembers(false);
    this.dialogService.openDialog(componentKey);
  }

  toggleChannels() {
    this.channels_opened = !this.channels_opened;

    if (!this.channels_opened) {
      this.channel_icon = 'arrow_right'
    } else {
      this.channel_icon = 'arrow_drop_down'
    }
  }

  toggleDM() {
    this.directmessages_opened = !this.directmessages_opened;

    if (!this.directmessages_opened) {
      this.directmessage_icon = 'arrow_right'
    } else {
      this.directmessage_icon = 'arrow_drop_down'
    }
  }

  editChannel(channel: Channel): void {
    this.channelsService.setSelectedChannel(channel);
    this.dialogService.openDialog('editChannel');
  }

  ngOnDestroy() {
    this.unsubChannels.unsubscribe();
  }

}
