import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared-services/authentication.service';
import { User } from '../models/user.class';
import { Router } from '@angular/router';
import { CommonService } from '../shared-services/common.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  user: User = new User();
  loginErrorPassword: boolean = false;
  emailVariable: string ='';

  constructor(private route: ActivatedRoute, private commonService: CommonService, private authService: AuthService, private router: Router,) {}

  isFormValid() {
    return this.user.password.length >= 8 &&
           this.user.password === this.user.confirmPassword           
  }

  isPasswordMatching(): boolean {
    return this.commonService.isPasswordMatching(this.user.password, this.user.confirmPassword);
  }

  changeInputPasswordToTxt(event: MouseEvent): void {
    this.commonService.changeInputPasswordToTxt(event);
  }

  async changePassword() {
    try {
      const oobCode = this.route.snapshot.queryParamMap.get('oobCode');
      if (!oobCode) {
        throw new Error('Fehlender oobCode');
      }
      await this.authService.confirmResetPassword(oobCode, this.user.password);
      this.router.navigate(['/login']);
    } catch (error) {
      this.loginErrorPassword = true;
    }
  }
}
