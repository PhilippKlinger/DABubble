import { Component } from '@angular/core';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Channel } from 'src/app/models/channel.class';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-channel',
  templateUrl: './dialog-create-channel.component.html',
  styleUrls: ['./dialog-create-channel.component.scss',
    '../dialog-show-profile/dialog-show-profile.component.scss',
    '../dialog-edit-profile/dialog-edit-profile.component.scss']
})


export class DialogCreateChannelComponent {

  channel = new Channel();


  constructor(private channelsService: ChannelsService, private dialogRef: MatDialogRef<DialogCreateChannelComponent>) { }

  createChannel(): void {
    this.channel.setCreator();
    this.channel.setTimestampNow();
    this.channelsService.createChannel(this.channel, 'channels').then((channelId) => {
      console.log('Neuer Kanal erstellt mit ID:', channelId);
      this.dialogRef.close();
      // hier den ersten dialog schließen und den nächsten für member hinzufügen öffnen
    }).catch(error => {
      console.error('Fehler beim Erstellen des Kanals:', error);
    });
  }

}
