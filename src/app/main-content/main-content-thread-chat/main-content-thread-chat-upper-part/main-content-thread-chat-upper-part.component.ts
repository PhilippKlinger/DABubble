import { Component } from '@angular/core';
import { DataService } from 'src/app/shared-services/data.service';

@Component({
  selector: 'app-main-content-thread-chat-upper-part',
  templateUrl: './main-content-thread-chat-upper-part.component.html',
  styleUrls: ['./main-content-thread-chat-upper-part.component.scss']
})
export class MainContentThreadChatUpperPartComponent {

  constructor(private dataService: DataService) { }

  thread_open: boolean = true;

  closeThreadChat() {
    // this.thread_open = !this.thread_open;
    this.dataService.setBooleanValue(false);
  }
}
