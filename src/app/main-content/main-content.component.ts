import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { DataService } from '../shared-services/data.service';
import { ChannelsService } from '../shared-services/channels.service';
import { User } from '../models/user.class';
import { AuthService } from '../shared-services/authentication.service';

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
  new_message_open: boolean = false;
  private userActivityTimeout: number = 15 * 60 * 1000; // 15 Minuten in Millisekunden
  private userActivityTimer: any;

  constructor(private dataService: DataService, private channelService: ChannelsService, private authService: AuthService) { }

  ngOnInit(): void {
    // Hier wird das thread_open boolean aus dem data.service.ts abonniert
    this.dataService.thread_open$.subscribe((value: boolean) => {
      // bei Veränderung des booleans wird folgende Funktion ausgelöst
      this.thread_open = value;
      this.resetUserActivityTimer(); // Zurücksetzen des Timers bei Aktivität
    });

    this.dataService.directmessage_open$.subscribe((value: boolean) => {
      this.directmessage_open = value;
      this.resetUserActivityTimer(); // Zurücksetzen des Timers bei Aktivität
    });

    this.dataService.new_message_open$.subscribe((value: boolean) => {
      this.new_message_open = value;
    });

    this.setCurrentUser();
    this.startUserActivityTimer(); // Starten Sie den Timer beim Initialisieren der Komponente
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
    this.resetUserActivityTimer();
  }

  updateThreadBoolean() {
    this.thread_open = this.dataService.getBooleanValue();
    this.resetUserActivityTimer();
  }

  // Event-Handler für Benutzeraktivität
  @HostListener('document:click', ['$event'])
  @HostListener('document:keydown', ['$event'])
  onUserActivity() {
    this.resetUserActivityTimer(); // Zurücksetzen des Timers bei Aktivität
  }

  private startUserActivityTimer(): void {
    this.userActivityTimer = setTimeout(() => {
      this.authService.logout(); // Führen Sie hier Ihre Logout-Funktion aus
    }, this.userActivityTimeout);
  }

  private resetUserActivityTimer(): void {
    clearTimeout(this.userActivityTimer); // Timer zurücksetzen
    this.startUserActivityTimer(); // Timer erneut starten
  }
}
