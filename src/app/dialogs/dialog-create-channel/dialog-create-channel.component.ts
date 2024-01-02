import { Component } from '@angular/core';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Channel } from 'src/app/models/channel.class';
import { MatDialogRef } from '@angular/material/dialog';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';

@Component({
  selector: 'app-dialog-create-channel',
  templateUrl: './dialog-create-channel.component.html',
  styleUrls: ['./dialog-create-channel.component.scss',
    '../dialog-show-profile/dialog-show-profile.component.scss',
    '../dialog-edit-profile/dialog-edit-profile.component.scss']
})


export class DialogCreateChannelComponent {

  channel = new Channel();


  constructor(private channelsService: ChannelsService, private dialogService: OpenDialogService , private dialogRef: MatDialogRef<DialogCreateChannelComponent>) { }

  createChannel(): void {
    this.channel.setCreator();
    this.channel.setTimestampNow();
    this.channel.addCreatorToMember();
    this.channelsService.createChannel(this.channel, 'channels').then(() => {
      this.channelsService.setSelectedChannel(this.channel);
      console.log('selectd channel is:', this.channel);
      this.dialogRef.close();
      this.dialogService.openDialog('addChannelmembers');
    }).catch(error => {
      console.error('Fehler beim Erstellen des Kanals:', error);
    });
  }

}
