import { Component } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { UserService } from 'src/app/shared-services/user.service';

@Component({
  selector: 'app-dialog-edit-profile',
  templateUrl: './dialog-edit-profile.component.html',
  styleUrls: ['./dialog-edit-profile.component.scss', '../dialog-show-profile/dialog-show-profile.component.scss']
})
export class DialogEditProfileComponent {
 
  currentUser!: User;
  users: User[] = [];

  constructor(private channelService: ChannelsService, private userService: UserService){
    this.channelService.currentUserInfo$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
    this.userService.users$.subscribe((users) => {
      this.users = users;
    })
  }

  async saveChanges(): Promise<void> {
    try {
      const currentUserIndex = this.users.findIndex(user => user.id === this.currentUser.id);
      console.log('currentUser', currentUserIndex)
      if (currentUserIndex !== -1) {
        // Den passenden Benutzer in der Liste finden
        const userToUpdate = this.users[currentUserIndex];
        console.log('user to update', userToUpdate)
        // Die gewünschten Änderungen vornehmen
        userToUpdate.name = this.currentUser.name;
        userToUpdate.email = this.currentUser.email;

        // Benutzerinformationen aktualisieren
        await this.userService.updateUser(userToUpdate);

        const updatedUserJSON = JSON.stringify(userToUpdate);
        sessionStorage.setItem('user', updatedUserJSON);
      }
    } catch (error) {
      console.error('Update User Info not possible:', error);
    }
  }

}
