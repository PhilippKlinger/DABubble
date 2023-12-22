import { Component } from '@angular/core';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';

@Component({
  selector: 'app-dialog-dummy',
  templateUrl: './dialog-dummy.component.html',
  styleUrls: ['./dialog-dummy.component.scss']
})
export class DialogDummyComponent {
  constructor(private dialogService: OpenDialogService) { }

  openDialog(componentKey: string): void {
    this.dialogService.openDialog(componentKey);
  }
}
