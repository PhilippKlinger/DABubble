import { Component } from '@angular/core';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Channel } from 'src/app/models/channel.class';
import { MatDialogRef } from '@angular/material/dialog';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { User } from 'src/app/models/user.class';
import { DataService } from 'src/app/shared-services/data.service';
import { UserService } from 'src/app/shared-services/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dialog-create-channel',
  templateUrl: './dialog-create-channel.component.html',
  styleUrls: ['./dialog-create-channel.component.scss',
    '../dialog-show-profile/dialog-show-profile.component.scss',
    '../dialog-edit-profile/dialog-edit-profile.component.scss']
})


export class DialogCreateChannelComponent {
  isMobileView!: boolean;
  channel = new Channel();
  currentUser!: User;
  isChannelNameTaken: boolean = false;
  isGuestUser!: boolean;
  private destroyed$ = new Subject<void>();

  constructor(private channelsService: ChannelsService,
    private dialogService: OpenDialogService,
    private dialogRef: MatDialogRef<DialogCreateChannelComponent>,
    private dataService: DataService,
    private userService: UserService) {
    this.channelsService.currentUserInfo$.pipe(takeUntil(this.destroyed$)).subscribe(currentUser => { this.currentUser = currentUser; });
    this.userService.isGuestUser$.pipe(takeUntil(this.destroyed$)).subscribe(isGuestUser => { this.isGuestUser = isGuestUser; });
    this.dialogService.isMobileView$.pipe(takeUntil(this.destroyed$)).subscribe((isMobileView) => { this.isMobileView = isMobileView; });
  }

  onInput() {
    this.checkChannelName();
  }

  checkChannelName(): void {
    this.channelsService.channels$.subscribe(channels => {
      this.isChannelNameTaken = channels.some(channel => channel.name === this.channel.name);
    });
  }

  activateCreateChannel(): boolean {
    return !this.isChannelNameTaken && this.channel.name.trim() !== '';

  }

  createChannel(): void {
    if (this.activateCreateChannel()) {

      this.channel.setCreator(this.currentUser.name);
      this.channel.setTimestampNow();
      this.channel.addCreatorToMembers(this.currentUser);
      this.channelsService.createChannel(this.channel, 'channels').then(() => {
        this.dataService.new_message_open$.next(false);
        this.dataService.thread_open$.next(false);
        this.dataService.directmessage_open$.next(false);
        this.channelsService.setSelectedChannel(this.channel);
        this.dialogRef.close();
        this.dialogService.openDialog('addChannelmembers', true, this.isMobileView);
      }).catch(error => {
        console.error('Fehler beim Erstellen des Kanals:', error);
      });
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

