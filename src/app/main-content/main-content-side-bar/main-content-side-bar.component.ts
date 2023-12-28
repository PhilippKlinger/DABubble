import { ComponentType } from '@angular/cdk/portal';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateChannelComponent } from 'src/app/dialogs/dialog-create-channel/dialog-create-channel.component';
import { DialogEditChannelComponent } from 'src/app/dialogs/dialog-edit-channel/dialog-edit-channel.component';
import { DialogEditProfileComponent } from 'src/app/dialogs/dialog-edit-profile/dialog-edit-profile.component';
import { DialogMenuProfileComponent } from 'src/app/dialogs/dialog-menu-profile/dialog-menu-profile.component';
import { DialogShowProfileComponent } from 'src/app/dialogs/dialog-show-profile/dialog-show-profile.component';

@Component({
  selector: 'app-main-content-side-bar',
  templateUrl: './main-content-side-bar.component.html',
  styleUrls: ['./main-content-side-bar.component.scss']
})
export class MainContentSideBarComponent {
  channel_icon: string = 'arrow_drop_down';
  channels_opened: boolean = true;
  directmessage_icon: string = 'arrow_drop_down';
  directmessages_opened: boolean = true;

  toggleChannels() {
    this.channels_opened = !this.channels_opened;

    if (!this.channels_opened) {
      this.channel_icon = 'arrow_right'
    } else {
      this.channel_icon = 'arrow_drop_down'
    }
  }

  toggleDM() {
    this.directmessages_opened = !this.directmessages_opened;

    if (!this.directmessages_opened) {
      this.directmessage_icon = 'arrow_right'
    } else {
      this.directmessage_icon = 'arrow_drop_down'
    }
  }

  /**
 * Mapping of component keys to their corresponding Angular component types.
 *
 * @type {Record<string, ComponentType<unknown>>}
 */
  dialogComponents: Record<string, ComponentType<unknown>> = {
    'showProfile': DialogShowProfileComponent,
    'menuProfile': DialogMenuProfileComponent,
    'editProfile': DialogEditProfileComponent,
    'createChannel': DialogCreateChannelComponent,
    'editChannel': DialogEditChannelComponent,
  };
  /**
 * Creates an instance of OpenDialogService.
 *
 * @constructor
 * @param {MatDialog} dialog - Angular Material dialog service.
 */
  constructor(private dialog: MatDialog) { }

  /**
   * Opens a dialog with the specified component key.
   *
   * @param {string} componentKey - Key corresponding to the desired dialog component.
   * @returns {void}
   */
  openDialog(componentKey: string): void {
    const selectedComponent = this.dialogComponents[componentKey];
    if (selectedComponent) {
      this.dialog.open(selectedComponent);
    } else {
      console.error(`Component with key ${componentKey} not found.`);
    }
  }
}
