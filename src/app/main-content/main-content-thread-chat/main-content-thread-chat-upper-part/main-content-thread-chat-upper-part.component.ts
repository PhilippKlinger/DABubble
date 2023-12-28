import { Component } from '@angular/core';
import { DataService } from 'src/app/shared-services/data.service';

@Component({
  selector: 'app-main-content-thread-chat-upper-part',
  templateUrl: './main-content-thread-chat-upper-part.component.html',
  styleUrls: ['./main-content-thread-chat-upper-part.component.scss']
})
export class MainContentThreadChatUpperPartComponent {

  constructor(private dataService: DataService) { }

  closeThreadChat() {
    //boolean wert wird in der data.service.ts geändert und bei veränderung wird eine funktion in main-content ausgelöst
    this.dataService.setBooleanValue(false);
  }
}
