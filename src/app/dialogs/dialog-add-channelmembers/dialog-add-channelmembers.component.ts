import { Component } from '@angular/core';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Channel } from 'src/app/models/channel.class';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-channelmembers',
  templateUrl: './dialog-add-channelmembers.component.html',
  styleUrls: ['./dialog-add-channelmembers.component.scss',
    '../dialog-show-profile/dialog-show-profile.component.scss',
    '../dialog-edit-profile/dialog-edit-profile.component.scss']
})
export class DialogAddChannelmembersComponent {
  selection = ['Alle Mitglieder von OfficeTeam hinzufügen', 'Bestimmte Leute hinzufügen'];
  selectedOption: 'allMembers' | 'specificMembers' = 'allMembers';
  specificMemberInput: string = '';
  users = ['Ersan', 'Martin', 'Philipp', 'Susan', 'Sam', 'Sarah'];  //user aus firestore abfragen
  filteredUsers: string[] = [];
  selectedUsers: string[] = [];
  needToAddMoreMembers: boolean = false;     //wenn dialog im channel geöffnet wird

  channel: Channel | null = null;
  selectedChannelSubscription: Subscription;

  constructor(private channelsService: ChannelsService, private dialogRef: MatDialogRef<DialogAddChannelmembersComponent>) {
    this.selectedChannelSubscription = this.channelsService.selectedChannel$.subscribe((channel) => {
      this.channel = channel;
    });
  }

  onInput() {
    this.filterUsers();
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.toLowerCase().includes(this.specificMemberInput.toLowerCase()) && !this.selectedUsers.includes(user)
    );
  }

  selectUser(user: string) {
    this.selectedUsers.push(user);
    this.specificMemberInput = '';
    this.filterUsers();
  }

  removeUser(user: string) {
    this.selectedUsers = this.selectedUsers.filter(u => u !== user);
    this.filterUsers();
  }

  addChannelMembers() {
    if (this.channel && !this.needToAddMoreMembers) {
      if (this.selectedOption === 'allMembers') {
        this.channel.members = this.channel.members.concat(this.users);
      } else if (this.selectedOption === 'specificMembers') {
        this.channel.members = this.channel.members.concat(this.selectedUsers);
      }
    } else if (this.channel && this.needToAddMoreMembers) {
      this.channel.members = this.channel.members.concat(this.selectedUsers);
    }

    if (this.channel) {
      this.channelsService.setSelectedChannel(this.channel);
      this.channelsService.updateChannel(this.channel);
      this.dialogRef.close();
    }
  }


  ngOnDestroy(): void {
    this.selectedChannelSubscription.unsubscribe();
  }
}
