import { Component } from '@angular/core';
import { AuthService } from '../shared-services/authentication.service';
import { User } from '../models/user.class';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user: User = new User();

  constructor(private authService: AuthService) {}

  register() {
    if (this.user.password === this.user.confirmPassword) {
      this.authService.register(this.user.email, this.user.password)
        .then(() => {
          // Erfolgsbehandlung, z.B. Weiterleitung zur nächsten Seite oder Anzeige einer Erfolgsmeldung
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            // Benutzer benachrichtigen, dass die E-Mail bereits verwendet wird
            // Zum Beispiel: Anzeigen einer Fehlermeldung in der Benutzeroberfläche
          } else {
            // Allgemeine Fehlerbehandlung für andere Fehlerarten
            // Zum Beispiel: Anzeigen einer generischen Fehlermeldung
          }
        });
    } else {
      // Fehlermeldung, wenn die Passwörter nicht übereinstimmen
      // Zum Beispiel: Anzeigen einer Fehlermeldung in der Benutzeroberfläche
    }
  }
  

  avatarPaths = [
    'assets/avatars/avatar_1.svg',
    'assets/avatars/avatar_2.svg',
    'assets/avatars/avatar_3.svg',
    'assets/avatars/avatar_4.svg',
    'assets/avatars/avatar_5.svg',
    'assets/avatars/avatar_6.svg',
  ];
  switch_expression: string = "login";

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
  }

  changeSwitchCase(newSwitchCase: string) {
    this.switch_expression = newSwitchCase;
    
    console.log(this.switch_expression);
  }
}
