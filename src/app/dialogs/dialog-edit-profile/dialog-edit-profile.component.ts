import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { UserService } from 'src/app/shared-services/user.service';
import { Auth, updateProfile } from '@angular/fire/auth';
import { Channel } from 'src/app/models/channel.class';
import { StorageService } from 'src/app/shared-services/storage.service';
@Component({
  selector: 'app-dialog-edit-profile',
  templateUrl: './dialog-edit-profile.component.html',
  styleUrls: ['./dialog-edit-profile.component.scss', '../dialog-show-profile/dialog-show-profile.component.scss']
})
export class DialogEditProfileComponent {

  newUserName: string = '';
  selectedAvatar!: string;
  currentUser!: User;
  users: User[] = [];
  selectedChannel!: Channel | null;

  openAvatarSelection:boolean = false;
  avatarFile: File | null = null;
  errorUploadFile: boolean = false;
  avatarPaths: string[] = [
    'assets/avatars/avatar_1.svg',
    'assets/avatars/avatar_2.svg',
    'assets/avatars/avatar_3.svg',
    'assets/avatars/avatar_4.svg',
    'assets/avatars/avatar_5.svg',
    'assets/avatars/avatar_6.svg',
  ];

  constructor(
    private auth: Auth,
    private channelService: ChannelsService,
    private userService: UserService,
    private dialogRef: MatDialogRef<DialogEditProfileComponent>,
    private storageService: StorageService
  ) {
    this.channelService.currentUserInfo$.subscribe((currentUser) => {
      this.currentUser = currentUser;
      this.newUserName = currentUser.name;
      this.selectedAvatar = currentUser.avatar;
    });
    this.userService.users$.subscribe((users) => {
      this.users = users;
    });
    this.channelService.selectedChannel$.subscribe((selectedChannel) => {
      this.selectedChannel = selectedChannel
    })
  }

  async saveChanges(): Promise<void> {
    try {
      const user = await this.auth.currentUser;
      if (!user) {
        console.error('Kein gültiger Benutzer gefunden');
        return;
      }

      const userToUpdate = this.users.find(u => u.id === this.currentUser.id);
      if (!userToUpdate) {
        console.error('Aktueller Benutzer nicht in der Benutzerliste gefunden');
        return;
      }

      // Aktualisieren des Profilnamens
      if (this.newUserName !== user.displayName) {
        await updateProfile(user, {
          displayName: this.newUserName
        });
      }

      // Update user info in Firestore
      userToUpdate.name = this.newUserName;
      userToUpdate.avatar = this.selectedAvatar,
      await this.userService.updateUser(userToUpdate);

      // Update user info in Session Storage
      sessionStorage.setItem('user', JSON.stringify(userToUpdate));
      this.channelService.currentUserInfo$.next(userToUpdate);


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

      await this.channelService.updateUserNameInAllMessages(user.uid, this.newUserName, this.selectedAvatar);
     
      this.channelService.refreshChannelsAfterEditingProfile();
      this.dialogRef.close();

    } catch (error) {
      console.error('Error updating user info:', error);
    }
  }

  toggleAvatarSelection() {
    this.openAvatarSelection = !this.openAvatarSelection;
  }

  changeAvatar(avatar: string): void {
    this.selectedAvatar = avatar;
    this.avatarFile = null;
    this.errorUploadFile = false;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const file = input.files[0];
    const MAX_FILE_SIZE = 1572864; 
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    this.errorUploadFile = !validTypes.includes(file.type) || file.size > MAX_FILE_SIZE;
  
    if (!this.errorUploadFile) {
      this.storageService.uploadFile(file).then(url => {
        this.selectedAvatar = url;
      }).catch(error => {
        console.error('Fehler beim Hochladen des Bildes', error);
      });
    }
  }
  


}


