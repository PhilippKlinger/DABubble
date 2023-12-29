import { ComponentType } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';

@Component({
  selector: 'app-main-content-main-chat-upper-part',
  templateUrl: './main-content-main-chat-upper-part.component.html',
  styleUrls: ['./main-content-main-chat-upper-part.component.scss']
})
export class MainContentMainChatUpperPartComponent {


  constructor(private dialogService: OpenDialogService) { }

  openDialog(componentKey: string): void {
    this.dialogService.openDialog(componentKey);
  }
}
