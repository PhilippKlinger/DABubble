// OpenDialogService.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { DialogShowProfileComponent } from '../dialogs/dialog-show-profile/dialog-show-profile.component';
import { DialogEditProfileComponent } from '../dialogs/dialog-edit-profile/dialog-edit-profile.component';
import { DialogCreateChannelComponent } from '../dialogs/dialog-create-channel/dialog-create-channel.component';
import { DialogEditChannelComponent } from '../dialogs/dialog-edit-channel/dialog-edit-channel.component';


@Injectable({
  providedIn: 'root'
})
export class OpenDialogService {
  constructor(private dialog: MatDialog) { }

  dialogComponents: Record<string, ComponentType<unknown>> = {
    'showProfile': DialogShowProfileComponent,
    'editProfile': DialogEditProfileComponent,
    'createChannel': DialogCreateChannelComponent,
    'editChannel': DialogEditChannelComponent,
  };

  openDialog(componentKey: string): void {
    const selectedComponent = this.dialogComponents[componentKey];

    if (selectedComponent) {
      this.dialog.open(selectedComponent);
    } else {
      console.error(`Component with key ${componentKey} not found.`);
    }
  }
}
