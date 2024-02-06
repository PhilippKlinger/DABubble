import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { User } from 'src/app/models/user.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { UserService } from 'src/app/shared-services/user.service';
import { DataService } from 'src/app/shared-services/data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MessagesService } from 'src/app/shared-services/messages.service';

@Component({
  selector: 'app-dialog-show-profile',
  templateUrl: './dialog-show-profile.component.html',
  styleUrls: ['./dialog-show-profile.component.scss']
})
export class DialogShowProfileComponent {
  private destroyed$ = new Subject<void>();
  channel: Channel | null = null;
  user: User | null = null;
  currentUser!: User;
  mobile: boolean = false;

  constructor(
    private channelsService: ChannelsService,
    private userService: UserService,
    private dataService: DataService,
    private dialogRef: MatDialogRef<DialogShowProfileComponent>,
    private messageService: MessagesService) {
    this.channelsService.selectedChannel$.pipe(takeUntil(this.destroyed$)).subscribe(channel => { this.channel = channel });
    this.userService.selectedUserforProfileView$.pipe(takeUntil(this.destroyed$)).subscribe(user => { this.user = user; });
    this.channelsService.currentUserInfo$.pipe(takeUntil(this.destroyed$)).subscribe(currentUser => { this.currentUser = currentUser; });
    this.dataService.mobile$.pipe(takeUntil(this.destroyed$)).subscribe(mobile => { this.mobile = mobile; });
  }

  openDM() {
    if (this.mobile) {
      this.dataService.directmessage_open$.next(true);
      this.dataService.thread_open$.next(false);
      this.dataService.new_message_open$.next(false);
      this.messageService.dm_user$.next(this.user);
      this.dataService.workspace_header_open$.next(true);
      this.dialogRef.close();
    } else {
      this.dataService.directmessage_open$.next(true);
      this.dataService.thread_open$.next(false);
      this.dataService.new_message_open$.next(false);
      this.messageService.dm_user$.next(this.user);
      this.dialogRef.close();
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
