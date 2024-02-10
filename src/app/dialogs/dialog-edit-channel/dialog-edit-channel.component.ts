import { Component } from '@angular/core';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Channel } from 'src/app/models/channel.class';
import { User } from 'src/app/models/user.class';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserService } from 'src/app/shared-services/user.service';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';

@Component({
  selector: 'app-dialog-edit-channel',
  templateUrl: './dialog-edit-channel.component.html',
  styleUrls: ['./dialog-edit-channel.component.scss',
    '../dialog-show-profile/dialog-show-profile.component.scss',
    '../dialog-edit-profile/dialog-edit-profile.component.scss',
    '../dialog-create-channel/dialog-create-channel.component.scss']
})
export class DialogEditChannelComponent {

  isEditingName: boolean = false;
  isEditingDescription: boolean = false;
  channel: Channel | null = null;
  newChannelName: string = '';
  newChannelDescription: string = '';
  isChannelNameTaken: boolean = false;
  currentUser!: User;
  isMobileView!: boolean;
  isGuestUser!: boolean;
  private destroyed$ = new Subject<void>();

  constructor(private channelsService: ChannelsService,
    private dialogRef: MatDialogRef<DialogEditChannelComponent>,
    private userService: UserService,
    private dialogService: OpenDialogService) {
    this.channelsService.selectedChannel$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(channel => {
      this.channel = channel;
      this.newChannelName = channel?.name || '';
      this.newChannelDescription = channel?.description || '';
    });
    this.channelsService.currentUserInfo$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(user => {
      this.currentUser = user;
    });
    this.userService.isGuestUser$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(isGuestUser => {
      this.isGuestUser = isGuestUser;
    });
    this.dialogService.isMobileView$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(isMobileView => {
      this.isMobileView = isMobileView;
    });
  }


  toggleEditing(field: 'name' | 'description'): void {
    if (field === 'name') {
      this.isEditingName = !this.isEditingName;
    } else if (field === 'description') {
      this.isEditingDescription = !this.isEditingDescription;
    }
  }


  saveChanges(field: 'name' | 'description'): void {
    if (!this.isGuestUser) {
      if (this.channel) {
        if (field === 'name') {
          this.channel.name = this.newChannelName;
          this.isEditingName = false;
        } else if (field === 'description') {
          this.channel.description = this.newChannelDescription;
          this.isEditingDescription = false;
        }
        this.channelsService.updateChannel(this.channel);
      }
    }
  }


  leaveChannel(): void {
    if (!this.isGuestUser) {
      if (this.channel && this.currentUser) {
        this.channel.members = this.channel.members.filter(member => member.id !== this.currentUser.id);
        this.channelsService.updateChannel(this.channel);
        if (this.channel.members.length === 0) {
          this.channelsService.deleteChannel(this.channel).then(() => {
            this.channelsService.findNextAvailableChannel();
          });
        } else {
          this.channelsService.findNextAvailableChannel();
        }
        this.dialogRef.close();
      }
    }
  }


  onInput() {
    this.checkChannelName();
  }


  checkChannelName(): void {
    this.channelsService.channels$.pipe(take(1)).subscribe(channels => {
      if (this.channel && this.newChannelName === this.channel.name) {
        this.isChannelNameTaken = false;
      } else {
        this.isChannelNameTaken = channels.some(channel => channel.name.toLowerCase() === this.newChannelName.toLowerCase());
      }
    });
  }


  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
