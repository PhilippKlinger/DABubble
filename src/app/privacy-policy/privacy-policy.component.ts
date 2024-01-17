import { Component } from '@angular/core';
import { CommonService } from '../shared-services/common.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {

  constructor(private commonService: CommonService){}

  backToLogin(router_link: string , seconds: number) {
    this.commonService.routeTo(router_link, seconds);
  }
}
