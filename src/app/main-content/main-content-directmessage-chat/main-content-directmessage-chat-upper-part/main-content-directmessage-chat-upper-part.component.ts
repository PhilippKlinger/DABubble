import { Component } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { MessagesService } from 'src/app/shared-services/messages.service';
import { UserService } from 'src/app/shared-services/user.service';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-main-content-directmessage-chat-upper-part',
  templateUrl: './main-content-directmessage-chat-upper-part.component.html',
  styleUrls: ['./main-content-directmessage-chat-upper-part.component.scss']
})
export class MainContentDirectmessageChatUpperPartComponent {
  dm_user: User | null = null!
  isMobileView!: boolean;
  private destroyed$ = new Subject<void>();


  constructor(private messageService: MessagesService,
    private dialogService: OpenDialogService,
    private userService: UserService,
    ) {
    this.messageService.dm_user$.pipe(
      takeUntil(this.destroyed$))
      .subscribe((dm_user) => {
      this.dm_user = dm_user;
    });
    this.dialogService.isMobileView$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(isMobileView => {
      this.isMobileView = isMobileView;
    });
  }

  showSelectedUser() {
    const user = this.dm_user
    if (user) {
      this.userService.setSelectedUser(user);
      this.dialogService.openDialog('showProfile', false, this.isMobileView);
    }
    
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  
}
