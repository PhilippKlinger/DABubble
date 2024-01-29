import { Component } from '@angular/core';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { AuthService } from '../../shared-services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared-services/user.service';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { User } from 'src/app/models/user.class';

@Component({
  selector: 'app-main-content-profile-selector',
  templateUrl: './main-content-profile-selector.component.html',
  styleUrls: ['./main-content-profile-selector.component.scss']
})
export class MainContentProfileSelectorComponent {
  profilemenu_open: boolean = false;
  currentUserInfo!: User;

  constructor(private dialogService: OpenDialogService, private authService: AuthService, private router: Router, private userService: UserService, private channelService: ChannelsService) {
    this.channelService.currentUserInfo$.subscribe(user => {
      this.currentUserInfo = user;
    });
  }

  toggleProfilemenu() {
    this.profilemenu_open = !this.profilemenu_open;
  }

  openDialog(componentKey: string): void {
    this.dialogService.openDialog(componentKey);
    this.profilemenu_open = false;
  }

  logout() {
    this.authService.logout();
  }
}
