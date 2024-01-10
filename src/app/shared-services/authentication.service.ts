import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, signOut, confirmPasswordReset} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) {}

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async loginWithGoogle() {
    return signInWithPopup( this.auth, new GoogleAuthProvider());
  }

  async resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async logout() {
    return signOut(this.auth);
  }

  async confirmResetPassword(oobCode: string, newPassword: string) {
    await confirmPasswordReset(this.auth, oobCode, newPassword);
  }
}
