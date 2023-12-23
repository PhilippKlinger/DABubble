import { Component } from '@angular/core';

@Component({
  selector: 'app-dialog-edit-channel',
  templateUrl: './dialog-edit-channel.component.html',
  styleUrls: ['./dialog-edit-channel.component.scss',
    '../dialog-show-profile/dialog-show-profile.component.scss',
    '../dialog-edit-profile/dialog-edit-profile.component.scss',
    '../dialog-create-channel/dialog-create-channel.component.scss']
})
export class DialogEditChannelComponent {
  isEditingName: boolean = false;
  isEditingDescription: boolean = false;

  toggleEditing(field: 'name' | 'description'): void {
    if (field === 'name') {
      this.isEditingName = !this.isEditingName;
    } else if (field === 'description') {
      this.isEditingDescription = !this.isEditingDescription;
    }
  }

  saveChanges(field: 'name' | 'description'): void {
    if (field === 'name') {
      this.isEditingName = false;
    } else if (field === 'description') {
      this.isEditingDescription = false;
    }
  }
}
