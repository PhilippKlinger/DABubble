import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { UserService } from 'src/app/shared-services/user.service';
import { Auth, updateEmail, updateProfile, sendEmailVerification } from '@angular/fire/auth';
import { AuthService } from 'src/app/shared-services/authentication.service';
import { CommonService } from 'src/app/shared-services/common.service';


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


  constructor(
    private auth: Auth,
    private channelService: ChannelsService,
    private userService: UserService,
    private dialogRef: MatDialogRef<DialogEditProfileComponent>,
    private authService: AuthService,
    private commonService: CommonService
  ) {
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
      const user = await this.auth.currentUser;
      const currentUserIndex = this.users.findIndex(u => u.id === this.currentUser.id);

      if (currentUserIndex !== -1 && user) {
        const userToUpdate = this.users[currentUserIndex];

        // Überprüfe, ob die E-Mail geändert wurde
        // if (this.newUserEmail !== user.email) {
        //    // Erstelle eine neue Instanz von User und füge tempEmail hinzu
        // const updatedUser = new User(userToUpdate);
        // updatedUser.tempEmail = this.newUserEmail;

        //   // Temporäre Speicherung der neuen E-Mail-Adresse in Firestore
        //   await this.userService.updateUser(updatedUser);
  
        //   // Sende Verifizierungs-E-Mail an die temporäre neue Adresse
        //   await sendEmailVerification({ ...user, email: this.newUserEmail });
        //   this.commonService.showPopup('EmailVerification');
        //   return;
        // }

        // Update Username in Firebase Auth
        await updateProfile(user, {
          displayName: this.newUserName,
        });

        // Update user info in Firestore
        userToUpdate.name = this.newUserName;
        userToUpdate.email = this.newUserEmail;
        await this.userService.updateUser(userToUpdate);
        // Update channel members
        const channels = this.channelService.channels$.value;
        channels.forEach(channel => {
          const members = channel.members || [];
          const index = members.findIndex(member => member.id === userToUpdate.id);

          if (index !== -1) {
            members[index] = userToUpdate.toJSON();
            this.channelService.updateChannel(channel);
          }
        });

        this.dialogRef.close();
        await this.authService.logout();
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  }


}