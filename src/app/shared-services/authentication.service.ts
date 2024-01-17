import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, signOut, confirmPasswordReset} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth, 
    private userService: UserService, 
    private router: Router
  ) {}

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async userVerified() {
    const user = this.auth.currentUser;
    return user?.emailVerified || false;
  }

  async register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async sendVerificationEmail() {
    const user = this.auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
      } catch (error) {
        console.error('Fehler beim Senden der Verifizierungs-E-Mail:', error);
      }
    } else {
      console.error('Benutzer ist nicht angemeldet');
    }
  }

  async loginWithGoogle() {
    return signInWithPopup( this.auth, new GoogleAuthProvider());
  }

  async resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async logout() {
    try {
      const userJson = sessionStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        await this.userService.setUserOnlineStatus(user.id, false);
        await signOut(this.auth);
        sessionStorage.removeItem('user');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Fehler beim Abmelden', error);
    }
  }


  async confirmResetPassword(oobCode: string, newPassword: string) {
    await confirmPasswordReset(this.auth, oobCode, newPassword);
  }
}
