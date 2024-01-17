import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DABubble';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'resetPassword') {
        this.router.navigate(['/reset-password'], { queryParams: params });
      }
      if (params['mode'] === 'verifyEmail') {
        this.router.navigate(['/verify-email'], { queryParams: params });
      }

    });
  }
}
