import { Component, OnInit } from '@angular/core';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Channel } from 'src/app/models/channel.class';
import { Subscription } from 'rxjs';
import { DialogEditChannelComponent } from '../dialog-edit-channel/dialog-edit-channel.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-dummy',
  templateUrl: './dialog-dummy.component.html',
  styleUrls: ['./dialog-dummy.component.scss'],

})
export class DialogDummyComponent implements OnInit {

  channels: Channel[] = [];
  unsubChannels!: Subscription;

  constructor(private dialogService: OpenDialogService, private channelsService: ChannelsService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.unsubChannels = this.channelsService.channels$.subscribe(channels => {
      this.channels = channels;
    });
  }

  async createChannel(item: Channel): Promise<void> {
    try {
      const channelId = await this.channelsService.createChannel(item, 'channels');
      // hier channel id verwenden
    } catch (error) {
      console.error('Failed to create channel:', error);
    }
  }

  openDialog(componentKey: string): void {
    this.dialogService.openDialog(componentKey);
  }

  deleteChannel(channel: Channel): void {
    this.channelsService.deleteChannel('channels', channel.id).then(() => {
      console.log('Channel gelöscht:', channel.id);
    }).catch(error => {
      console.error('Fehler beim Löschen des Kanals:', error);
    });
  }

  editChannel(channel: Channel): void {
    this.channelsService.setSelectedChannel(channel);
    this.dialog.open(DialogEditChannelComponent);
  }

  ngOnDestroy() {
    this.unsubChannels.unsubscribe();
  }
}
