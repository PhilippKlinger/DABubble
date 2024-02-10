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
  selectedOption: 'allMembers' | 'specificMembers' | 'noMembers' | null = null;
  specificMemberInput: string = '';

  filteredUsers: User[] = [];
  selectedUsers: User[] = [];
  isGuestUser!: boolean;
  needToAddMoreMembers: boolean = false;
  addLastUser: boolean = false;
  areUsersAvailable: boolean = true;
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
    this.userService.isGuestUser$.pipe(takeUntil(this.destroyed$)).subscribe(isGuestUser => { this.isGuestUser = isGuestUser; });
    this.updateUsersAvailability();
  }


  onInput() {
    this.filterUsers();
    this.updateUsersAvailability();
  }


  updateUsersAvailability() {
    const currentMemberCount = this.channel ? this.channel.members.length : 0;
    const totalUserCount = this.users.filter(user => user.id !== this.userService.guestId).length;
    const selectedUserCount = this.selectedUsers.length;
    this.areUsersAvailable = ((currentMemberCount + selectedUserCount) < totalUserCount);
    this.addLastUser = (currentMemberCount < totalUserCount);
  }


  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const isGuestUser = user.id === this.userService.guestId;
      const userAlreadySelected = this.selectedUsers.includes(user);
      const userMatchesInput = user.name.toLowerCase().includes(this.specificMemberInput.toLowerCase());
      if (isGuestUser || userAlreadySelected) return false;
      if (this.channel) {
        const isUserInChannel = this.channel.members.some(channelUser => channelUser.id === user.id);
        return userMatchesInput && !isUserInChannel;
      }
      return userMatchesInput;
    });
  }


  selectUser(user: User) {
    this.selectedUsers.push(user);
    this.specificMemberInput = '';
    this.filterUsers();
    this.updateUsersAvailability();
  }


  removeUser(user: User) {
    this.selectedUsers = this.selectedUsers.filter(u => u !== user);
    this.filterUsers();
    this.updateUsersAvailability();
  }


  addChannelMembers() {
    if (!this.channel) {
      return;
    }
    const newMembers = this.startAddingMember();
    const updatedMembers: User[] = [...this.channel.members, ...newMembers]
      .filter((member, index, self) => index === self.findIndex(t => t.id === member.id));

    this.completeAddingMember(this.channel, updatedMembers)
  }


  startAddingMember() {
    let newMembers: { id: string; name: string; email: string; avatar: string; onlineStatus: boolean; }[] = [];
    if (this.needToAddMoreMembers || this.selectedOption === 'specificMembers') {
      newMembers = this.selectedUsers
        .filter(user => user.id !== this.userService.guestId)
        .map(user => user.toJSON());
    } else if (this.selectedOption === 'allMembers') {
      newMembers = this.users
        .filter(user => user.id !== this.currentUser.id && user.id !== this.userService.guestId)
        .map(user => user.toJSON());
    }
    return newMembers;
  }


  completeAddingMember(channel: Channel, updatedMembers: User[]) {
    channel.members = updatedMembers;
    this.channelsService.updateChannel(this.channel);
    this.channelsService.selectedChannel$.next(this.channel);
    this.dialogRef.close();
    this.dialogService.setNeedToAddMoreMembers(false);
  }

  
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
