import { Component } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Auth } from '@angular/fire/auth';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dialog-menu-profile',
  templateUrl: './dialog-menu-profile.component.html',
  styleUrls: ['./dialog-menu-profile.component.scss', '../dialog-show-profile/dialog-show-profile.component.scss']
})
export class DialogMenuProfileComponent {

  currentUser!: User;
  isLoggedInWithGoogle: boolean = false;
  private destroyed$ = new Subject<void>();


  constructor(private channelService: ChannelsService, private FbAuth: Auth, private dialogService: OpenDialogService, private dialogRef: MatDialogRef<DialogMenuProfileComponent>) {
    this.channelService.currentUserInfo$.pipe(takeUntil(this.destroyed$)).subscribe((currentUser) => { this.currentUser = currentUser });
    this.checkAuthenticationProvider();
  }


  async checkAuthenticationProvider() {
    try {
      const user = await this.FbAuth.currentUser;
      if (user) {
        this.isLoggedInWithGoogle = user.providerData.some(provider => provider.providerId === 'google.com');
      }
    } catch (error) {
      console.error('Error checking authentication provider:', error);
    }
  }


  openEditProfile() {
    if (!this.isLoggedInWithGoogle) {
      this.dialogRef.close();
      this.dialogService.openDialog('editProfile');
    } else {
      window.open("https://myaccount.google.com/")
    }
  }


  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}