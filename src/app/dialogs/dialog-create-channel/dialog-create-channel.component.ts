import { Component } from '@angular/core';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Channel } from 'src/app/models/channel.class';
import { MatDialogRef } from '@angular/material/dialog';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { User } from 'src/app/models/user.class';
import { DataService } from 'src/app/shared-services/data.service';

@Component({
  selector: 'app-dialog-create-channel',
  templateUrl: './dialog-create-channel.component.html',
  styleUrls: ['./dialog-create-channel.component.scss',
    '../dialog-show-profile/dialog-show-profile.component.scss',
    '../dialog-edit-profile/dialog-edit-profile.component.scss']
})


export class DialogCreateChannelComponent {

  channel = new Channel();
  currentUser!: User;
  isChannelNameTaken: boolean = false;

  constructor(private channelsService: ChannelsService,
    private dialogService: OpenDialogService,
    private dialogRef: MatDialogRef<DialogCreateChannelComponent>,
    private dataService: DataService) {
    this.channelsService.currentUserInfo$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
  }

  onInput() {
    this.checkChannelName();
  }

  checkChannelName(): void {
    this.channelsService.channels$.subscribe(channels => {
      this.isChannelNameTaken = channels.some(channel => channel.name === this.channel.name);
    });
  }

  createChannel(): void {
    if (!this.isChannelNameTaken) {
      this.channel.setCreator(this.currentUser.name);
      this.channel.setTimestampNow();
      this.channel.addCreatorToMembers(this.currentUser);
      this.channelsService.createChannel(this.channel, 'channels').then(() => {
        this.channelsService.setSelectedChannel(this.channel);
        this.dataService.new_message_open$.next(false);
        this.dataService.thread_open$.next(false);
        this.dataService.directmessage_open$.next(false);
        this.dialogRef.close();
        this.dialogService.openDialog('addChannelmembers', true);
      }).catch(error => {
        console.error('Fehler beim Erstellen des Kanals:', error);
      });
    }
  }
}

