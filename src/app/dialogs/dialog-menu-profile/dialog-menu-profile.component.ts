import { Component } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { UserService } from 'src/app/shared-services/user.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-menu-profile',
  templateUrl: './dialog-menu-profile.component.html',
  styleUrls: ['./dialog-menu-profile.component.scss', '../dialog-show-profile/dialog-show-profile.component.scss']
})
export class DialogMenuProfileComponent {

  currentUser!: User;

  constructor(private channelService: ChannelsService, private userService: UserService, private dialogService: OpenDialogService, private dialogRef: MatDialogRef<DialogMenuProfileComponent>){
    this.channelService.currentUserInfo$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    })
  }

  openEditProfile(){
    this.dialogRef.close();
  this.dialogService.openDialog('editProfile');
  }

}
