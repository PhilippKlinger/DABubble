import { Component, OnInit } from '@angular/core';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Channel } from 'src/app/models/channel.class';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-main-content-main-chat-upper-part',
  templateUrl: './main-content-main-chat-upper-part.component.html',
  styleUrls: ['./main-content-main-chat-upper-part.component.scss']
})
export class MainContentMainChatUpperPartComponent {
  selectedChannel!: Channel | null;
  unsubChannels!: Subscription;

  constructor(private dialogService: OpenDialogService, private ChannelsService: ChannelsService) {
    this.unsubChannels = this.ChannelsService.selectedChannel$.subscribe(selectedChannel => {
      this.selectedChannel = selectedChannel;
      console.log(this.selectedChannel)
    });
  }

  openDialog(componentKey: string): void {
    this.dialogService.openDialog(componentKey);
  }

  ngOnDestroy() {
    this.unsubChannels.unsubscribe();
  }
}
