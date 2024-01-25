import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { User } from 'src/app/models/user.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { UserService } from 'src/app/shared-services/user.service';
import { DataService } from 'src/app/shared-services/data.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-show-profile',
  templateUrl: './dialog-show-profile.component.html',
  styleUrls: ['./dialog-show-profile.component.scss']
})
export class DialogShowProfileComponent {

  channel: Channel | null = null;
  selectedChannelSubscription: Subscription;
  user: User | null = null;
  selectedUserSubscription: Subscription;

  constructor(
    private channelsService: ChannelsService,
     private userService: UserService,
      private dataService: DataService,
      private dialogRef: MatDialogRef<DialogShowProfileComponent>){
    this.selectedChannelSubscription = this.channelsService.selectedChannel$.subscribe((channel) => {
      this.channel = channel;
    });
    this.selectedUserSubscription = this.userService.selectedUserforProfileView$.subscribe((user) => {
      this.user = user;
    })
  }

  openDM() {
    this.dataService.directmessage_open$.next(true);
    this.dataService.thread_open$.next(false);
    this.userService.dm_user$.next(this.user);
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.selectedChannelSubscription.unsubscribe();
    this.selectedChannelSubscription.unsubscribe();
  }

}
