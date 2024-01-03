import { Component } from '@angular/core';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { AuthService } from '../../shared-services/authentication.service';
import { Router } from '@angular/router';
import { AuthenticationStateService } from '../../shared-services/authenticationState.service';
import { UserService } from 'src/app/shared-services/user.service';

@Component({
  selector: 'app-main-content-profile-selector',
  templateUrl: './main-content-profile-selector.component.html',
  styleUrls: ['./main-content-profile-selector.component.scss']
})
export class MainContentProfileSelectorComponent {
  profilemenu_open: boolean = false;

  constructor(private dialogService: OpenDialogService, private authService: AuthService, private router: Router, private authStateService: AuthenticationStateService, private userService: UserService) {}

  toggleProfilemenu() {
    this.profilemenu_open = !this.profilemenu_open;
  }

  openDialog(componentKey: string): void {
    this.dialogService.openDialog(componentKey);
  }

  logout() {
    const currentUserId = this.authStateService.getCurrentUserId();
  
    if (currentUserId) {
      this.userService.setUserOnlineStatus(currentUserId, false)
        .then(() => {
          return this.authService.logout();
        })
        .then(() => {
          this.authStateService.clearCurrentUserId();
          this.router.navigate(['/login']);
        })
        .catch(error => {
          console.error('Fehler beim Abmelden', error);
        });
    }
  }
}
