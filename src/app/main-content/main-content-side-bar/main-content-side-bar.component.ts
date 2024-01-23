import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { User } from 'src/app/models/user.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { DataService } from 'src/app/shared-services/data.service';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(private dialogService: OpenDialogService,
    private channelsService: ChannelsService,
    private dataService: DataService,
    private snackBar: MatSnackBar) {
    this.channelsService.currentUserInfo$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
    this.unsubChannels = this.channelsService.channels$.subscribe(channels => {
      this.channels = channels;
    });
  }


  openDM() {
    this.dataService.directmessage_open$.next(true);
    this.dataService.thread_open$.next(false);
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
