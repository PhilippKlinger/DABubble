import { Component } from '@angular/core';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { AuthService } from '../../shared-services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared-services/user.service';

@Component({
  selector: 'app-main-content-profile-selector',
  templateUrl: './main-content-profile-selector.component.html',
  styleUrls: ['./main-content-profile-selector.component.scss']
})
export class MainContentProfileSelectorComponent {
  profilemenu_open: boolean = false;

  constructor(private dialogService: OpenDialogService, private authService: AuthService, private router: Router, private userService: UserService) {}

  toggleProfilemenu() {
    this.profilemenu_open = !this.profilemenu_open;
  }

  openDialog(componentKey: string): void {
    this.dialogService.openDialog(componentKey);
  }

  logout() {
    const userJson = sessionStorage.getItem('user');  
    if (userJson) {
      const user = JSON.parse(userJson);
      this.userService.setUserOnlineStatus(user.id, false)
        .then(() => {
          return this.authService.logout();
        })
        .then(() => {
          sessionStorage.removeItem('user'); 
          this.router.navigate(['/login']);
        })
        .catch(error => {
          console.error('Fehler beim Abmelden', error);
        });
    }
  }
}
