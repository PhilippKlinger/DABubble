import { Component } from '@angular/core';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent {
  workspace_open: boolean = true;

  toggleWorkspace() {
    this.workspace_open = !this.workspace_open;
    console.log(this.workspace_open);
  }
}
