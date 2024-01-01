import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { DataService } from 'src/app/shared-services/data.service';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';

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

  constructor(private dialogService: OpenDialogService, private channelsService: ChannelsService, private dataService: DataService) {
    this.unsubChannels = this.channelsService.channels$.subscribe(channels => {
      this.channels = channels;
    });
  }

  openDM() {
    //aktualisiert die variable in meiner data.service.ts, woraufhin sich die variable in der main-component mit aktualisiert
    this.dataService.directmessage_open.next(true);
  }

  openDialog(componentKey: string): void {
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
