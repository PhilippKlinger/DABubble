import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { UserService } from 'src/app/shared-services/user.service';



@Component({
  selector: 'app-dialog-edit-profile',
  templateUrl: './dialog-edit-profile.component.html',
  styleUrls: ['./dialog-edit-profile.component.scss', '../dialog-show-profile/dialog-show-profile.component.scss']
})
export class DialogEditProfileComponent {
 
  newUserName: string = '';
  newUserEmail: string = '';
  currentUser!: User;
  users: User[] = [];
  

  constructor(private channelService: ChannelsService, private userService: UserService, private dialogRef: MatDialogRef<DialogEditProfileComponent>){
    this.channelService.currentUserInfo$.subscribe((currentUser) => {
      this.currentUser = currentUser;
      this.newUserName = currentUser.name;
      this.newUserEmail = currentUser.email;
    });
    this.userService.users$.subscribe((users) => {
      this.users = users;
    })
   
  }
  
  async saveChanges(): Promise<void> {
    try {
      const currentUserIndex = this.users.findIndex(user => user.id === this.currentUser.id);
      if (currentUserIndex !== -1) {
        const userToUpdate = this.users[currentUserIndex];
        
        userToUpdate.name = this.newUserName;
        userToUpdate.email = this.newUserEmail;

        await this.userService.updateUser(userToUpdate);

        const updatedUserJSON = JSON.stringify(userToUpdate);
        sessionStorage.setItem('user', updatedUserJSON);

        // Aktualisierung der Kanalmitglieder 
        const channels = this.channelService.channels$.value;
        channels.forEach((channel) => {
          const members = channel.members || [];
          const index = members.findIndex((member) => member.id === userToUpdate.id);

          if (index !== -1) {
            members[index] = userToUpdate.toJSON();
            this.channelService.updateChannel(channel);
          }
        });

        this.dialogRef.close();
      }
    } catch (error) {
      console.error('Update User Info not possible:', error);
    }
  }
}
