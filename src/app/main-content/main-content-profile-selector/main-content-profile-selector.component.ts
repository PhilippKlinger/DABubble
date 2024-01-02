import { Component } from '@angular/core';

@Component({
  selector: 'app-main-content-profile-selector',
  templateUrl: './main-content-profile-selector.component.html',
  styleUrls: ['./main-content-profile-selector.component.scss']
})
export class MainContentProfileSelectorComponent {
  profilemenu_open: boolean = false;

  toggleProfilemenu() {
    this.profilemenu_open = !this.profilemenu_open;
  }
}
