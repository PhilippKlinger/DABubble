import { ComponentType } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditChannelComponent } from 'src/app/dialogs/dialog-edit-channel/dialog-edit-channel.component';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';

@Component({
  selector: 'app-main-content-main-chat-upper-part',
  templateUrl: './main-content-main-chat-upper-part.component.html',
  styleUrls: ['./main-content-main-chat-upper-part.component.scss']
})
export class MainContentMainChatUpperPartComponent {
  /**
   * Mapping of component keys to their corresponding Angular component types.
   *
   * @type {Record<string, ComponentType<unknown>>}
   */
  dialogComponents: Record<string, ComponentType<unknown>> = {
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
