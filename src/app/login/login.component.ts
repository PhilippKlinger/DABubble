import { Component } from '@angular/core';
import { AuthService } from '../shared-services/authentication.service';
import { User } from '../models/user.class';
import { UserService } from '../shared-services/user.service';
import { StorageService } from '../shared-services/storage.service';
import { CommonService } from '../shared-services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user: User = new User();
  isCheckboxChecked: boolean = false;
  selectedAvatar = 'assets/avatars/avatar_0.svg';
  selectedAvatarIndex: number = -1;
  avatarFile: File | null = null;
  errorUploadFile: boolean = false;

  avatarPaths = [
    'assets/avatars/avatar_1.svg',
    'assets/avatars/avatar_2.svg',
    'assets/avatars/avatar_3.svg',
    'assets/avatars/avatar_4.svg',
    'assets/avatars/avatar_5.svg',
    'assets/avatars/avatar_6.svg',
  ];
  switch_expression: string = "login";
  loginErrorUser: boolean = false;
  loginErrorPassword: boolean = false;

  constructor(private authService: AuthService, private userService: UserService, private storageService: StorageService, private commonService: CommonService) {}

  async login() {
    if (await this.checkUserExists()) {
      this.authService.login(this.user.email, this.user.password)
      .then((userCredential) => {
        this.setUserOnline(userCredential);
        this.commonService.showPopup('login');
        this.commonService.routeTo('main-content');
      })
      .catch(error => {
        if (error.code === 'auth/too-many-requests' || error.code === 'auth/invalid-credential' || error.code === 'auth/missing-password') {
          this.loginErrorPassword = true;
        }
      });
    }  
  }

  async setUserOnline(userCredential: any) {
    let userId = userCredential.user.uid; 
    await this.userService.setUserOnlineStatus(userId, true);
    let userInfo = await this.userService.getUserInfos(userId);
    if (userInfo) {        
      sessionStorage.setItem('user', JSON.stringify(userInfo));
    }
  }

  

  async checkUserExists() {
    this.loginErrorUser = false;
    this.loginErrorPassword = false;
    let userExists = await this.userService.userExistsByEmail(this.user.email);
    if (!userExists) {
      this.loginErrorUser = true;
      return false;
    } else {
      return true;
    }
  }

  loginGuest() {
    this.loginErrorUser = false;
    this.authService.login('guest@guest.com', 'Guestlogin')
      .then((userCredential) => {
        this.setUserOnline(userCredential);
        this.commonService.showPopup('login');  
        this.commonService.routeTo('main-content');
      })
  }

  async loginGoogle() {
    try {
      let result = await this.authService.loginWithGoogle();
      let googleUser = result.user;
      if (googleUser.email && googleUser.displayName) {
        this.checkGooleUserExistsAndCreate(googleUser);
        await this.setUserOnline(result);
        this.commonService.showPopup('login');
        this.commonService.routeTo('main-content');
      } else {        
        console.log("Google-Konto hat keine gültige E-Mail oder keinen Namen.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async checkGooleUserExistsAndCreate(googleUser: any) {
    let userExists = await this.userService.userExistsByEmail(googleUser.email);  
    if (!userExists) {
      this.createNewGoogleUser(googleUser);
    }
  }

  async createNewGoogleUser(googleUser: any) {
    let newUser: User = new User({
      email: googleUser.email,
      name: googleUser.displayName,
      avatar: 'assets/avatars/google.svg',
      onlineStatus: true,
      id: googleUser.uid
    });  
    await this.userService.createUser(newUser, 'users');
  }

  isFormValid() {
    return this.validateEmail(this.user.email) &&
           this.user.name.length >= 5 &&
           this.user.password.length >= 8 &&
           this.user.password === this.user.confirmPassword &&
           this.isCheckboxChecked;
           
  }

  validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  isPasswordMatching(): boolean {
    return this.commonService.isPasswordMatching(this.user.password, this.user.confirmPassword);
  }

  async moveToAvatar() {
    if (!await this.checkUserExists()) {
      this.changeSwitchCase('avatar');
    } else {
      this.loginErrorUser = true;
    }
  }
  

  async register() {
    this.loginErrorUser = false;
    if (this.avatarFile) {
      await this.storageService.uploadFile(this.avatarFile);
    }   
    this.authService.register(this.user.email, this.user.password)
      .then((userCredential) => {
        this.createNormalUser(userCredential);
      })
      .catch((error) => {
        console.log(error);
      }); 
  }

  createNormalUser(userCredential: any) {
    this.user.id = userCredential.user.uid;
    this.user.onlineStatus = false;
    this.user.avatar = this.selectedAvatar;
    this.userService.createUser(this.user, 'users');
    this.commonService.showPopup('register');
    this.switchLogin('register')
  }

  switchLogin(popup_name:string) {
    setTimeout(() => {
      this.setDNonePopup(popup_name);
      this.changeSwitchCase('login');
    },2000);
  }

  setDNonePopup(popup_name:string) {
    const popup = document.getElementById(popup_name);
    if (popup) {
      popup.classList.add('d-none'); 
    };  
  }

  async setNewPassword() {
    if (await this.checkUserExists()) {
      this.loginErrorUser = false;
      this.authService.resetPassword(this.user.email)
      .then (() => { 
        this.commonService.showPopup('new-pass');
        this.switchLogin('new-pass');
      });
    }
  }
 

  changeInputPasswordToTxt(event: MouseEvent): void {
    this.commonService.changeInputPasswordToTxt(event);
  }

  changeCheckboxCheck(event: MouseEvent): void {
    let checkboxElement = event.target as HTMLElement;
    checkboxElement.classList.toggle('checked');
    this.isCheckboxChecked = checkboxElement.classList.contains('checked');
  }

  changeSwitchCase(newSwitchCase: string) {
    if ((this.switch_expression === 'avatar' && newSwitchCase === 'signup') || (this.switch_expression === 'forgotPassword' && newSwitchCase === 'login')) {
    } else if (newSwitchCase === 'signup' || newSwitchCase === 'forgotPassword' || newSwitchCase === 'login') {
      this.user = new User();
    } 
    this.loginErrorUser = false;
    this.switch_expression = newSwitchCase;
  }

  changeToSignupAndUncheck() {
    this.isCheckboxChecked = false;
    this.changeSwitchCase('signup');
  }

  changeAvatar(newAvatar: string, index: number): void {
    this.errorUploadFile = false;
    this.selectedAvatar = newAvatar;
    this.selectedAvatarIndex = index;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files){
      return;
    }
    const file = input.files[0];
    const fileType = file.type;
    const MAX_FILE_SIZE = 5242880;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    this.errorUploadFile = !validTypes.includes(fileType) || file.size > MAX_FILE_SIZE;
    if (!this.errorUploadFile) {
        this.selectedAvatar = URL.createObjectURL(file);
        this.avatarFile = file;
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
        fileInput.click();
    } 
  }
}
