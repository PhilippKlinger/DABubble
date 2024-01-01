import { Component, OnInit, ViewChild, } from '@angular/core';
import { DataService } from '../shared-services/data.service';
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

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    //Hier wird das thread_open boolean aus dem data.service.ts abonniert
    this.dataService.thread_open.subscribe((value: boolean) => {
      //bei veränderung des booleans wird folgende funktion ausgelöst
      this.thread_open = value;
    });
  }

  toggleWorkspace() {
    this.workspace_open = !this.workspace_open;
    // this.directmessage_open = !this.directmessage_open;
  }

  updateThreadBoolean() {
    this.thread_open = this.dataService.getBooleanValue();
  }
}
