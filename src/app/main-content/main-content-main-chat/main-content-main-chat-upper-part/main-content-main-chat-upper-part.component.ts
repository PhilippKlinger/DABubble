import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { OpenDialogService } from 'src/app/shared-services/open-dialog.service';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Channel } from 'src/app/models/channel.class';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.class';
@Component({
  selector: 'app-main-content-main-chat-upper-part',
  templateUrl: './main-content-main-chat-upper-part.component.html',
  styleUrls: ['./main-content-main-chat-upper-part.component.scss']
})
export class MainContentMainChatUpperPartComponent {
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkMobileView();
  }
  @ViewChild('triggerElement1', { static: true }) triggerElement1!: ElementRef;
  @ViewChild('triggerElement2', { static: true }) triggerElement2!: ElementRef;
  @ViewChild('triggerElement3', { static: true }) triggerElement3!: ElementRef;

  isMobileView: boolean = false;
  selectedChannel!: Channel | null;
  unsubChannels!: Subscription;
  members: User[] = [];

  constructor(private dialogService: OpenDialogService, private ChannelsService: ChannelsService) {
    this.unsubChannels = this.ChannelsService.selectedChannel$.subscribe(selectedChannel => {
      this.selectedChannel = selectedChannel;

      if (selectedChannel?.members !== undefined) {
        this.members = selectedChannel?.members;
      } else {
        console.log('no selected channel avaialble');
      }
    });
    this.checkMobileView();
  }

  openDialog(componentKey: string, triggerNumber?: number): void {
    this.dialogService.setNeedToAddMoreMembers(true);
    let triggerElement: ElementRef | null = null;

    if (triggerNumber === 1 && this.triggerElement1) {
      triggerElement = this.triggerElement1;
    } else if (triggerNumber === 2 && this.triggerElement2) {
      triggerElement = this.triggerElement2;
      this.dialogService.setDialogTriggerElementRef(triggerElement);
    } else if (triggerNumber === 3 && this.triggerElement3) {
      triggerElement = this.triggerElement3;
    }
    if (triggerElement) {
      this.dialogService.openDialog(componentKey, false, this.isMobileView, triggerElement);
    } else {
      this.dialogService.openDialog(componentKey);
    }
  }

  checkMobileView(): void {
    this.isMobileView = window.innerWidth <= 650;
  }


  ngOnDestroy() {
    this.unsubChannels.unsubscribe();
  }
}
