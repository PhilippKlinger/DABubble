import { Component } from '@angular/core';
import { AuthService } from '../shared-services/authentication.service';
import { User } from '../models/user.class';
import { UserService } from '../shared-services/user.service';
import { Router } from '@angular/router';
import { AuthenticationStateService } from '../shared-services/authenticationState.service';

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

  constructor(private authService: AuthService, private authStateService: AuthenticationStateService, private userService: UserService, private router: Router) {}

  login() {
    this.authService.login(this.user.email, this.user.password)
    .then((userCredential) => {
      this.authStateService.setCurrentUserId(userCredential.user.uid);
      this.router.navigate(['/main-content']);
    })
    .catch(error => {
      console.error('Anmeldefehler', error);
    });
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

  register() {
    if (this.user.password === this.user.confirmPassword) {
      this.authService.register(this.user.email, this.user.password)
        .then((userCredential) => {
          this.user.id = userCredential.user.uid;
          this.user.onlineStatus = true;
          this.user.avatar = this.selectedAvatar;
          this.userService.createUser(this.user, 'users');
          this.changeSwitchCase('login');
        })
        .catch((error) => {
          console.log(error);
          if (error.code === 'auth/email-already-in-use') {
            console.log("email already exist");
          } else {
            console.log("an unexpected error occurred")
          }
        });
    }
  }


  changeInputPasswordToTxt(event: MouseEvent): void {
    let imgElement = event.target as HTMLElement;
    let parentElement = imgElement.parentElement;
    let inputElement = parentElement?.querySelector('input') as HTMLInputElement;

    if (inputElement) {
      inputElement.type = inputElement.type === 'password' ? 'text' : 'password';
    }
  }

  changeCheckboxCheck(event: MouseEvent): void {
    let checkboxElement = event.target as HTMLElement;
    checkboxElement.classList.toggle('checked');
    this.isCheckboxChecked = checkboxElement.classList.contains('checked');
  }

  changeSwitchCase(newSwitchCase: string) {
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
