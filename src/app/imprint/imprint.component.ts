import { Component } from '@angular/core';
import { CommonService } from '../shared-services/common.service';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.scss']
})
export class ImprintComponent {
  constructor(public commonService: CommonService){}
}
