import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { applyActionCode } from 'firebase/auth';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {
  verifying = false;
  verified = false;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private auth: Auth) {}

  ngOnInit() {
    this.verifying = true;
    this.route.queryParams.subscribe(params => {
      const oobCode = params['oobCode'];
      if (oobCode) {
        this.verifyEmail(oobCode);
      }
    });
  }

  verifyEmail(oobCode: string) {
    applyActionCode(this.auth, oobCode)
      .then(() => {
        this.verified = true;
        this.verifying = false;
      })
      .catch(error => {
        this.errorMessage = error.message;
        this.verifying = false;
      });
  }
}
