import { Component } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { UserService } from 'src/app/shared-services/user.service';

@Component({
  selector: 'app-main-content-directmessage-chat-upper-part',
  templateUrl: './main-content-directmessage-chat-upper-part.component.html',
  styleUrls: ['./main-content-directmessage-chat-upper-part.component.scss']
})
export class MainContentDirectmessageChatUpperPartComponent {
  dm_user: User | null = null!

  constructor(private userService: UserService) {
    this.userService.dm_user$.subscribe((dm_user) => {
      this.dm_user = dm_user;
    });
  }
  
}
