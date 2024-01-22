import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { User } from 'src/app/models/user.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { UserService } from 'src/app/shared-services/user.service';

@Component({
  selector: 'app-dialog-show-profile',
  templateUrl: './dialog-show-profile.component.html',
  styleUrls: ['./dialog-show-profile.component.scss']
})
export class DialogShowProfileComponent {

  channel: Channel | null = null;
  selectedChannelSubscription: Subscription;
  user: User | null = null;
  selectedUserSubscription: Subscription;

  constructor(private channelsService: ChannelsService, private userService: UserService){
    this.selectedChannelSubscription = this.channelsService.selectedChannel$.subscribe((channel) => {
      this.channel = channel;
    });
    this.selectedUserSubscription = this.userService.selectedUserforProfileView$.subscribe((user) => {
      this.user = user;
    })
  }


  ngOnDestroy(): void {
    this.selectedChannelSubscription.unsubscribe();
    this.selectedChannelSubscription.unsubscribe();
  }

}
