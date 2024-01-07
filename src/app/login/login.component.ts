import { Component } from '@angular/core';
import { AuthService } from '../shared-services/authentication.service';
import { User } from '../models/user.class';
import { UserService } from '../shared-services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user: User = new User();
  isCheckboxChecked = false;
  selectedAvatar = 'assets/avatars/avatar_0.svg';
  selectedAvatarIndex: number = -1;
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

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  async login() {
    if (await this.checkUserExists()) {
      this.authService.login(this.user.email, this.user.password)
      .then((userCredential) => {
        this.setUserOnline(userCredential);
        this.router.navigate(['/main-content']);
      })
      .catch(error => {
        if (error.code === 'auth/too-many-requests' || error.code === 'auth/invalid-credential' || error.code === 'auth/missing-password') {
          this.loginErrorPassword = true;
        }
      });
    }  
  }

  setUserOnline(userCredential: any) {
    let userId = userCredential.user.uid;
    sessionStorage.setItem('user', JSON.stringify(userCredential.user));
    return this.userService.setUserOnlineStatus(userId, true);
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

  async loginGoogle() {
    try {
      let result = await this.authService.loginWithGoogle();
      let googleUser = result.user;
      if (googleUser.email && googleUser.displayName) {
        this.checkGooleUserExistsAndCreate(googleUser);
        await this.setUserOnline(result);
        this.router.navigate(['/main-content']);        
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
    return this.user.password === this.user.confirmPassword;
  }

  async moveToAvatar() {
    if (!await this.checkUserExists()) {
      this.changeSwitchCase('avatar');
    } else {
      this.loginErrorUser = true;
    }
  }
  

  async register() {
    if (this.user.password === this.user.confirmPassword) {
      this.authService.register(this.user.email, this.user.password)
        .then((userCredential) => {
          this.createNormalUser(userCredential);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  createNormalUser(userCredential: any) {
    this.user.id = userCredential.user.uid;
    this.user.onlineStatus = false;
    this.user.avatar = this.selectedAvatar;
    this.userService.createUser(this.user, 'users');
    this.changeSwitchCase('login');
  }

  setNewPassword() {
    this.authService.resetPassword(this.user.email)
    .then (() => { 
      this.changeSwitchCase('login');
    });
  }
 

  changeInputPasswordToTxt(event: MouseEvent): void {
    let imgElement = event.target as HTMLImageElement;
    let parentElement = imgElement.parentElement;
    let inputElement = parentElement?.querySelector('input') as HTMLInputElement;

    if (inputElement) {
      inputElement.type = inputElement.type === 'password' ? 'text' : 'password';
      imgElement.src = inputElement.type === 'password' ? 'assets/icons/visibility_off.svg' : 'assets/icons/visibility.svg';
    }
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
    this.switch_expression = newSwitchCase;
  }

  changeToSignupAndUncheck() {
    this.isCheckboxChecked = false;
    this.changeSwitchCase('signup');
  }

  changeAvatar(newAvatar: string, index: number): void {
    this.selectedAvatar = newAvatar;
    this.selectedAvatarIndex = index;
  }
}
