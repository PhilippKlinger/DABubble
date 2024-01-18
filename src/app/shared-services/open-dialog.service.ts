import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { DialogShowProfileComponent } from '../dialogs/dialog-show-profile/dialog-show-profile.component';
import { DialogEditProfileComponent } from '../dialogs/dialog-edit-profile/dialog-edit-profile.component';
import { DialogCreateChannelComponent } from '../dialogs/dialog-create-channel/dialog-create-channel.component';
import { DialogEditChannelComponent } from '../dialogs/dialog-edit-channel/dialog-edit-channel.component';
import { DialogMenuProfileComponent } from '../dialogs/dialog-menu-profile/dialog-menu-profile.component';
import { DialogAddChannelmembersComponent } from '../dialogs/dialog-add-channelmembers/dialog-add-channelmembers.component';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DialogShowChannelmembersComponent } from '../dialogs/dialog-show-channelmembers/dialog-show-channelmembers.component';

@Injectable({
  providedIn: 'root'
})
export class OpenDialogService {

  public needToAddMoreMembers$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // private needToAddMoreMembersSubject = new BehaviorSubject<boolean>(false);
  // needToAddMoreMembers$ = this.needToAddMoreMembersSubject.asObservable();

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
    'addChannelmembers': DialogAddChannelmembersComponent,
    'showChannelmembers': DialogShowChannelmembersComponent
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
  openDialog(componentKey: string, disableClose: boolean = false): void {
    const selectedComponent = this.dialogComponents[componentKey];
    if (selectedComponent) {
      this.dialog.open(selectedComponent, {
        disableClose: disableClose
      });
    } else {
      console.error(`Component with key ${componentKey} not found.`);
    }
  }

  setNeedToAddMoreMembers(value: boolean): void {
    this.needToAddMoreMembers$.next(value);
  }
}
