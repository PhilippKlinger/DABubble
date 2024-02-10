import { Injectable, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { DialogShowProfileComponent } from '../dialogs/dialog-show-profile/dialog-show-profile.component';
import { DialogEditProfileComponent } from '../dialogs/dialog-edit-profile/dialog-edit-profile.component';
import { DialogCreateChannelComponent } from '../dialogs/dialog-create-channel/dialog-create-channel.component';
import { DialogEditChannelComponent } from '../dialogs/dialog-edit-channel/dialog-edit-channel.component';
import { DialogMenuProfileComponent } from '../dialogs/dialog-menu-profile/dialog-menu-profile.component';
import { DialogAddChannelmembersComponent } from '../dialogs/dialog-add-channelmembers/dialog-add-channelmembers.component';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DialogShowChannelmembersComponent } from '../dialogs/dialog-show-channelmembers/dialog-show-channelmembers.component';
import { DialogShowWelcomeMessageComponent } from '../dialogs/dialog-show-welcome-message/dialog-show-welcome-message.component';
import { fromEvent, map, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenDialogService {

  public needToAddMoreMembers$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isMobileView$ = fromEvent(window, 'resize').pipe(
    startWith(this.checkMobileView()),
    map(() => this.checkMobileView())
  );

  private _dialogTriggerElementRef: ElementRef | null = null;

  dialogComponents: Record<string, ComponentType<unknown>> = {
    'showProfile': DialogShowProfileComponent,
    'menuProfile': DialogMenuProfileComponent,
    'editProfile': DialogEditProfileComponent,
    'createChannel': DialogCreateChannelComponent,
    'editChannel': DialogEditChannelComponent,
    'addChannelmembers': DialogAddChannelmembersComponent,
    'showChannelmembers': DialogShowChannelmembersComponent,
    'showWelcomeMessage': DialogShowWelcomeMessageComponent,
  };

  constructor(private dialog: MatDialog) { }

  setDialogTriggerElementRef(elementRef: ElementRef) {
    this._dialogTriggerElementRef = elementRef;
  }


  getDialogTriggerElementRef(): ElementRef | null {
    return this._dialogTriggerElementRef;
  }


  openDialog(componentKey: string, disableClose: boolean = false, mobileView: boolean = false, origin?: ElementRef): void {
    const selectedComponent = this.dialogComponents[componentKey];
    if (!selectedComponent) {
      console.error(`Component with key ${componentKey} not found.`);
      return;
    }
    const dialogConfig = this.getDialogConfig(componentKey, disableClose, mobileView, origin);
    this.dialog.open(selectedComponent, dialogConfig);
  }


  private getDialogConfig(componentKey: string, disableClose: boolean, mobileView: boolean, origin?: ElementRef): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = disableClose;
    switch (componentKey) {
      case 'createChannel':
        this.configureCreateChannelDialog(dialogConfig);
        break;
      case 'editChannel':
        this.configureEditChannelDialog(dialogConfig, mobileView, origin);
        break;
      case 'showChannelmembers':
        this.configureShowChannelmembersDialog(dialogConfig, mobileView, origin);
        break;
      case 'addChannelmembers':
        this.configureAddChannelmembersDialog(dialogConfig, disableClose, mobileView, origin);
        break;
      case 'showProfile || menuProfile':
        this.configureProfileDialog(dialogConfig, mobileView);
        break;
    }
    return dialogConfig;
  }


  private configureCreateChannelDialog(dialogConfig: MatDialogConfig): void {
    dialogConfig.width = '872px';
  }


  private configureProfileDialog(dialogConfig: MatDialogConfig, mobileView: boolean): void {
    if (mobileView) {
      dialogConfig.maxWidth = '100%';
    } else {
      dialogConfig.width = '500px';
    }
  }


  private configureEditChannelDialog(dialogConfig: MatDialogConfig, mobileView: boolean, origin?: ElementRef): void {
    if (origin && !mobileView) {
      dialogConfig.panelClass = 'dialog-edit-channel-no-radius';
      const rect = origin.nativeElement.getBoundingClientRect();
      dialogConfig.position = { top: `${rect.bottom}px`, left: `${rect.left}px` };
    }
  }


  private configureShowChannelmembersDialog(dialogConfig: MatDialogConfig, mobileView: boolean, origin?: ElementRef): void {
    if (origin && !mobileView) {
      dialogConfig.panelClass = 'dialog-show-channelmembers-no-radius';
      const rect = origin.nativeElement.getBoundingClientRect();
      const dialogWidth = 415;
      const leftPosition = rect.right - dialogWidth;
      dialogConfig.position = { top: `${rect.bottom}px`, left: `${leftPosition}px` };
    }
  }


  private configureAddChannelmembersDialog(dialogConfig: MatDialogConfig, disableClose: boolean, mobileView: boolean, origin?: ElementRef): void {
    if (origin && !mobileView) {
      dialogConfig.panelClass = 'dialog-add-channelmembers-no-radius';
      const rect = origin.nativeElement.getBoundingClientRect();
      const dialogWidth = 514;
      const leftPosition = rect.right - dialogWidth;
      dialogConfig.position = { top: `${rect.bottom}px`, left: `${leftPosition}px` };
    }
    if (mobileView) {
      dialogConfig.panelClass = 'dialog-add-channelmembers-mobile';
    }
    if (disableClose === true && !mobileView) {
      dialogConfig.panelClass = 'dialog-add-channelmembers-responsive';
    }
    if (disableClose === true && mobileView) {
      dialogConfig.panelClass = 'dialog-add-channelmembers-mobile-2';
    }
  }


  checkMobileView(): boolean {
    return window.innerWidth <= 650;
  }


  setNeedToAddMoreMembers(value: boolean): void {
    this.needToAddMoreMembers$.next(value);
  }
}