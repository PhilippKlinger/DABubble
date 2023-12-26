import { Component, OnInit } from '@angular/core';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Channel } from 'src/app/models/channel.class';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog-dummy',
  templateUrl: './dialog-dummy.component.html',
  styleUrls: ['./dialog-dummy.component.scss']
})
export class DialogDummyComponent implements OnInit {

  channels: Channel[] = [];
  unsubChannels!: Subscription;

  constructor(private dialogService: OpenDialogService, private channelsService: ChannelsService) {
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

  ngOnDestroy() {
    this.unsubChannels.unsubscribe();
  }
}
