import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
  }
}
