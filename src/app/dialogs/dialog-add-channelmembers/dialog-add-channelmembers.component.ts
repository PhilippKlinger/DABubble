import { Component } from '@angular/core';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Channel } from 'src/app/models/channel.class';
import { User } from 'src/app/models/user.class';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/shared-services/user.service';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dialog-add-channelmembers',
  templateUrl: './dialog-add-channelmembers.component.html',
  styleUrls: ['./dialog-add-channelmembers.component.scss',
    '../dialog-show-profile/dialog-show-profile.component.scss',
    '../dialog-edit-profile/dialog-edit-profile.component.scss']
})
export class DialogAddChannelmembersComponent {
  selection = ['Alle Mitglieder von OfficeTeam hinzufügen', 'Bestimmte Leute hinzufügen'];
  selectedOption: 'allMembers' | 'specificMembers' | 'noMembers' | null = null;
  specificMemberInput: string = '';

  filteredUsers: User[] = [];
  selectedUsers: User[] = [];

  needToAddMoreMembers: boolean = false;
  channel: Channel | null = null;
  users: User[] = [];
  currentUser!: User;
  private destroyed$ = new Subject<void>();

  constructor(private channelsService: ChannelsService,
    private dialogService: OpenDialogService,
    private userService: UserService,
    private dialogRef: MatDialogRef<DialogAddChannelmembersComponent>) {
    this.channelsService.selectedChannel$.pipe(takeUntil(this.destroyed$)).subscribe(channel => { this.channel = channel; });
    this.userService.users$.pipe(takeUntil(this.destroyed$)).subscribe(users => { this.users = users; });
    this.dialogService.needToAddMoreMembers$.pipe(takeUntil(this.destroyed$)).subscribe(state => { this.needToAddMoreMembers = state; });
    this.channelsService.currentUserInfo$.pipe(takeUntil(this.destroyed$)).subscribe(user => { this.currentUser = user; });
  }

  onInput() {
    this.filterUsers();
    console.log('selectedUser lenght =', this.selectedUsers.length)
  }

  filterUsers() {
    if (this.channel) {
      const channelMembers = this.channel.members || [];
      this.filteredUsers = this.users.filter(user => {
        const userIncluded = channelMembers.some(channelUser => channelUser.id === user.id);
        return (
          user.name.toLowerCase().includes(this.specificMemberInput.toLowerCase()) &&
          !this.selectedUsers.includes(user) &&
          !userIncluded
        );
      });
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(this.specificMemberInput.toLowerCase()) &&
        !this.selectedUsers.includes(user)
      );
    }
  }


  selectUser(user: User) {
    this.selectedUsers.push(user);
    this.specificMemberInput = '';
    this.filterUsers();
  }

  removeUser(user: User) {
    this.selectedUsers = this.selectedUsers.filter(u => u !== user);
    this.filterUsers();
  }

  addChannelMembers() {
    if (this.channel) {
      let newMembers: { id: string; name: string; email: string; avatar: string; onlineStatus: boolean; }[] = [];
  
      if (!this.needToAddMoreMembers) {
        if (this.selectedOption === 'allMembers') {
          // Verhindere, dass der aktuelle Benutzer erneut hinzugefügt wird
          newMembers = this.users
            .filter(user => user.id !== this.currentUser.id)
            .map(user => user.toJSON());
        } else if (this.selectedOption === 'specificMembers') {
          newMembers = this.selectedUsers.map(user => user.toJSON());
        }
      } else {
        newMembers = this.selectedUsers.map(user => user.toJSON());
      }
  
      const uniqueMembers = [...new Set([...this.channel.members, ...newMembers])];
      this.channel.members = uniqueMembers;
  
      this.channelsService.setSelectedChannel(this.channel);
      this.channelsService.updateChannel(this.channel);
      this.dialogRef.close();
      this.dialogService.setNeedToAddMoreMembers(false);
    }
  }
  


  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
