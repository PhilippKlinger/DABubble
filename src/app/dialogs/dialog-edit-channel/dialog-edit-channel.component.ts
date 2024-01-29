import { Component } from '@angular/core';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Channel } from 'src/app/models/channel.class';
import { User } from 'src/app/models/user.class';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { take } from 'rxjs/operators';
import { DataService } from 'src/app/shared-services/data.service';



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
  currentUser!: User;
  private destroyed$ = new Subject<void>();

  constructor(private channelsService: ChannelsService,
     private dialogRef: MatDialogRef<DialogEditChannelComponent>,
     private dataService: DataService) {
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
  }

  toggleEditing(field: 'name' | 'description'): void {
    if (field === 'name') {
      this.isEditingName = !this.isEditingName;
    } else if (field === 'description') {
      this.isEditingDescription = !this.isEditingDescription;
    }
  }

  saveChanges(field: 'name' | 'description'): void {
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

  leaveChannel(): void {
    if (this.channel && this.currentUser) {
      this.channel.members = this.channel.members.filter(member => member.id !== this.currentUser.id);
      this.channelsService.updateChannel(this.channel);
      if (this.channel.members.length === 0) {
        this.channelsService.deleteChannel(this.channel).then(() => {
          this.selectNextAvailableChannel();
        });
      } else {
        this.selectNextAvailableChannel();
        this.channelsService.setSelectedChannel(this.channel);
      }
      this.dialogRef.close();
    }
  }

  selectNextAvailableChannel(): void {
    this.channelsService.channels$.pipe(
      take(1)
    ).subscribe(channels => {
      const firstMemberChannel = channels.find(channel =>
        this.channelsService.isCurrentUserChannelMember(channel)
      );
      if (firstMemberChannel) {
        this.channelsService.setSelectedChannel(firstMemberChannel);
      } else {
        this.openNewMessageInput();
      }
    });
  }

  openNewMessageInput() {
    this.dataService.new_message_open$.next(true);
    this.dataService.thread_open$.next(false);
    this.dataService.directmessage_open$.next(false);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
