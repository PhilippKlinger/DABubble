import { Injectable, ElementRef  } from '@angular/core';
import { MatDialog, MatDialogConfig  } from '@angular/material/dialog';
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
  private _dialogTriggerElementRef: ElementRef | null = null;
  
  dialogComponents: Record<string, ComponentType<unknown>> = {
    'showProfile': DialogShowProfileComponent,
    'menuProfile': DialogMenuProfileComponent,
    'editProfile': DialogEditProfileComponent,
    'createChannel': DialogCreateChannelComponent,
    'editChannel': DialogEditChannelComponent,
    'addChannelmembers': DialogAddChannelmembersComponent,
    'showChannelmembers': DialogShowChannelmembersComponent
  };

  
  constructor(private dialog: MatDialog) { }

  setDialogTriggerElementRef(elementRef: ElementRef) {
    this._dialogTriggerElementRef = elementRef;
  }

  getDialogTriggerElementRef(): ElementRef | null {
    return this._dialogTriggerElementRef;
  }
  
  openDialog(componentKey: string, disableClose: boolean = false, origin?: ElementRef): void {
    
    const selectedComponent = this.dialogComponents[componentKey];
    if (selectedComponent) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = disableClose;

        if (componentKey === 'editChannel' && origin && window.innerWidth >= 650) {
          dialogConfig.panelClass = 'dialog-edit-channel-no-radius';
          const rect = origin.nativeElement.getBoundingClientRect();
          dialogConfig.position = { top: `${rect.bottom}px`, left: `${rect.left}px` };
        }

        if (componentKey === 'showChannelmembers' && origin && window.innerWidth >= 650) {
          dialogConfig.panelClass = 'dialog-show-channelmembers-no-radius';
          const rect = origin.nativeElement.getBoundingClientRect();
          const dialogWidth = 415; // Feste Breite des Dialogs
          // Berechnung der linken Position, um den Dialog rechtsbündig zum Trigger-Element zu positionieren
          const leftPosition = rect.right - dialogWidth;
          dialogConfig.position = { top: `${rect.bottom}px`, left: `${leftPosition}px` };
        }
  
        if (componentKey === 'addChannelmembers' && origin && window.innerWidth >= 650) {
          dialogConfig.panelClass = 'dialog-add-channelmembers-no-radius';
          const rect = origin.nativeElement.getBoundingClientRect();
          const dialogWidth = 514; // Feste Breite des Dialogs
          // Berechnung der linken Position, um den Dialog rechtsbündig zum Trigger-Element zu positionieren
          const leftPosition = rect.right - dialogWidth;
          dialogConfig.position = { top: `${rect.bottom}px`, left: `${leftPosition}px` };
        }

        
      
      
       
        if (componentKey === 'createChannel') {
          dialogConfig.panelClass = 'dialog-create-channel-repsonsive';
        }

        if (componentKey === 'addChannelmembers' && disableClose === true ) {
          dialogConfig.panelClass = 'dialog-add-channelmembers-responsive';
        }
  
        if (componentKey === ('showProfile' || 'menuProfile')) {
          dialogConfig.panelClass = 'dialog-show-profile-responsive';
        }
    

      this.dialog.open(selectedComponent, dialogConfig);
    } else {
      console.error(`Component with key ${componentKey} not found.`);
    }
}


  setNeedToAddMoreMembers(value: boolean): void {
    this.needToAddMoreMembers$.next(value);
  }
}
