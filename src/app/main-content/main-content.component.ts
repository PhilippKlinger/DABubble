import { Component, OnInit, ViewChild, } from '@angular/core';
import { DataService } from '../shared-services/data.service';
import { ChannelsService } from '../shared-services/channels.service';
import { User } from '../models/user.class';
@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  @ViewChild('grid') grid: any;
  workspace_open: boolean = true;
  thread_open!: boolean;
  directmessage_open: boolean = false;

  constructor(private dataService: DataService, private channelService: ChannelsService) { }

  ngOnInit(): void {
    //Hier wird das thread_open boolean aus dem data.service.ts abonniert
    this.dataService.thread_open$.subscribe((value: boolean) => {
      //bei veränderung des booleans wird folgende funktion ausgelöst
      this.thread_open = value;
    });

    this.dataService.directmessage_open$.subscribe((value: boolean) => {
      this.directmessage_open = value;
    });

    this.setCurrentUser();
  }

  setCurrentUser() {
    let currentUser = sessionStorage.getItem('user');
    if (currentUser) {
      let userInfo = JSON.parse(currentUser);
      this.channelService.currentUserInfo$.next(userInfo);
    }
  }

  toggleWorkspace() {
    this.workspace_open = !this.workspace_open;
    // this.directmessage_open = !this.directmessage_open;
  }

  updateThreadBoolean() {
    this.thread_open = this.dataService.getBooleanValue();
  }
}
