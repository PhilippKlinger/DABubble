import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { UserService } from 'src/app/shared-services/user.service';
import { Auth, updateProfile } from '@angular/fire/auth';
import { Channel } from 'src/app/models/channel.class';
import { StorageService } from 'src/app/shared-services/storage.service';
import { Subject, takeUntil } from 'rxjs';
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
  isGuestUser!: boolean;
  private destroyed$ = new Subject<void>();
  isSavingNewData: boolean = false;
  openAvatarSelection: boolean = false;
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
    private channelsService: ChannelsService,
    private userService: UserService,
    private dialogRef: MatDialogRef<DialogEditProfileComponent>,
    private storageService: StorageService
  ) {
    this.channelsService.currentUserInfo$.pipe(takeUntil(this.destroyed$)).subscribe((currentUser) => {
      this.currentUser = currentUser;
      this.newUserName = currentUser.name;
      this.selectedAvatar = currentUser.avatar;
    });
    this.userService.users$.pipe(takeUntil(this.destroyed$)).subscribe((users) => { this.users = users });
    this.channelsService.selectedChannel$.pipe(takeUntil(this.destroyed$)).subscribe(selectedChannel => { this.selectedChannel = selectedChannel });
    this.userService.isGuestUser$.pipe(takeUntil(this.destroyed$)).subscribe((isGuestUser) => { this.isGuestUser = isGuestUser; });
  }


  async saveChanges(): Promise<void> {
    try {
     this.isSavingNewData = true;
      await this.updateUserProfile();
      await this.updateFirestoreUserInfo();
      this.updateSessionStorageUserInfo();
      await this.updateChannelMembers();
      await this.updateMessagesWithNewUserInfo();
      this.isSavingNewData = false;
      this.dialogRef.close();
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  }


  private async updateUserProfile() {
    const user = await this.auth.currentUser;
    if (!user) throw new Error('Kein gültiger Benutzer gefunden');
    if (this.newUserName !== user.displayName) {
      await updateProfile(user, { displayName: this.newUserName });
    }
  }


  private async updateFirestoreUserInfo() {
    const userToUpdate = this.users.find(u => u.id === this.currentUser.id);
    if (!userToUpdate) throw new Error('Aktueller Benutzer nicht in der Benutzerliste gefunden');
    userToUpdate.name = this.newUserName;
    userToUpdate.avatar = this.selectedAvatar;
    await this.userService.updateUser(userToUpdate);
  }


  private updateSessionStorageUserInfo() {
    const userToUpdate = this.users.find(u => u.id === this.currentUser.id);
    if (!userToUpdate) {
      throw new Error('Benutzer konnte nicht aktualisiert werden, weil er nicht gefunden wurde.');
    }
    sessionStorage.setItem('user', JSON.stringify(userToUpdate));
    this.channelsService.currentUserInfo$.next(userToUpdate);
  }


  private async updateChannelMembers() {
    const channels = this.channelsService.channels$.value;
    channels.forEach(async channel => {
      const index = channel.members.findIndex(member => member.id === this.currentUser.id);
      if (index !== -1) {
        channel.members[index] = this.currentUser.toJSON();
        await this.channelsService.updateChannel(channel);
      }
    });
  }


  private async updateMessagesWithNewUserInfo() {
    await this.channelsService.updateUserNameInAllMessages(this.currentUser.id, this.newUserName, this.selectedAvatar);
    this.channelsService.refreshChannelsAfterEditingProfile();
  }


  toggleAvatarSelection() {
    this.openAvatarSelection = !this.openAvatarSelection;
  }


  changeAvatar(avatar: string): void {
    this.selectedAvatar = avatar;
    this.avatarFile = null;
    this.errorUploadFile = false;
  }


  uploadAvatar(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const file = input.files[0];
    const MAX_FILE_SIZE = 1572864;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    this.errorUploadFile = !validTypes.includes(file.type) || file.size > MAX_FILE_SIZE;
    this.setUploadedAvatar(file);
  }


  setUploadedAvatar(file: File) {
    if (!this.errorUploadFile) {
      this.storageService.uploadFile(file).then(url => {
        this.selectedAvatar = url;
      }).catch(error => {
        console.error('Fehler beim Hochladen des Bildes', error);
      });
    }
  }

  
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}


