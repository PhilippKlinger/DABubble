import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Channel } from 'src/app/models/channel.class';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';


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
  selectedChannelSubscription: Subscription;

  constructor(private channelsService: ChannelsService, private dialogRef: MatDialogRef<DialogEditChannelComponent>) {
    this.selectedChannelSubscription = this.channelsService.selectedChannel$.subscribe((channel) => {
      this.channel = channel;
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
    this.channelsService.updateChannel(this.channel)
    if (field === 'name') {
      this.isEditingName = false;
    } else if (field === 'description') {
      this.isEditingDescription = false;
    }
  }

  ngOnDestroy(): void {
    this.selectedChannelSubscription.unsubscribe();
  }
}
