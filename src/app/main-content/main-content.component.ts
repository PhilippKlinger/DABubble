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
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.thread_open = this.dataService.getBooleanValue();
  }

  toggleWorkspace() {
    this.workspace_open = !this.workspace_open;
  }

  updateThreadBoolean() {
    this.thread_open = this.dataService.getBooleanValue();
  }
}
