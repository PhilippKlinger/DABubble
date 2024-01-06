import { Component } from '@angular/core';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Channel } from 'src/app/models/channel.class';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user.class';
import { UserService } from 'src/app/shared-services/user.service';

@Component({
  selector: 'app-dialog-show-channelmembers',
  templateUrl: './dialog-show-channelmembers.component.html',
  styleUrls: ['./dialog-show-channelmembers.component.scss',
  '../dialog-show-profile/dialog-show-profile.component.scss',
  '../dialog-edit-profile/dialog-edit-profile.component.scss']
})
export class DialogShowChannelmembersComponent {

  channel: Channel | null = null;
  selectedChannelSubscription: Subscription;

  constructor(private dialogService: OpenDialogService, private channelsService: ChannelsService, private userService: UserService, private dialogRef: MatDialogRef<DialogShowChannelmembersComponent>){
    this.selectedChannelSubscription = this.channelsService.selectedChannel$.subscribe((channel) => {
      this.channel = channel;
    });
  }

  showSelectedUser(user: User){
    this.userService.setSelectedUser(user);
    this.dialogService.openDialog('showProfile');
    this.dialogRef.close();
  }

  openDialog(componentKey: string): void {
    this.dialogService.setNeedToAddMoreMembers(true);
    this.dialogRef.close();
    this.dialogService.openDialog(componentKey);
  }
}
