import { Component } from '@angular/core';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Channel } from 'src/app/models/channel.class';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user.class';
import { UserService } from 'src/app/shared-services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-dialog-show-channelmembers',
  templateUrl: './dialog-show-channelmembers.component.html',
  styleUrls: ['./dialog-show-channelmembers.component.scss',
    '../dialog-show-profile/dialog-show-profile.component.scss',
    '../dialog-edit-profile/dialog-edit-profile.component.scss']
})
export class DialogShowChannelmembersComponent {
  isMobileView!: boolean;
  private destroyed$ = new Subject<void>();
  channel: Channel | null = null;

  constructor(private dialogService: OpenDialogService, private channelsService: ChannelsService, private userService: UserService, private dialogRef: MatDialogRef<DialogShowChannelmembersComponent>) {
    this.channelsService.selectedChannel$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(channel => {
      this.channel = channel;
    });
    this.dialogService.isMobileView$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(isMobileView => {
      this.isMobileView = isMobileView;
    });
  }

  showSelectedUser(user: User) {
    this.userService.setSelectedUser(user);
    this.dialogService.openDialog('showProfile', false, this.isMobileView);
  }

  openDialog(componentKey: string): void {
    const origin = this.dialogService.getDialogTriggerElementRef();
    this.dialogService.setNeedToAddMoreMembers(true);
    this.dialogRef.close();
    if (origin) {
      this.dialogService.openDialog(componentKey, false, this.isMobileView, origin);
    }
  }

  openDialogMobile(componentKey: string): void {
    this.dialogService.setNeedToAddMoreMembers(true);
    this.dialogService.openDialog(componentKey, false, this.isMobileView);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
