import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-main-content-new-message',
  templateUrl: './main-content-new-message.component.html',
  styleUrls: ['./main-content-new-message.component.scss']
})
export class MainContentNewMessageComponent {
  emoji_window_open: boolean = false;
  @ViewChild('message') input_message!: ElementRef;

  constructor() {
  }

  addEmoji($event: any) {
    if ($event.emoji.native !== '🫥') {
      this.input_message.nativeElement.value += $event.emoji.native;
      //console.log($event.emoji);
      this.emoji_window_open = false;
    }
  }

  toggleEmojiWindow() {
    this.emoji_window_open = !this.emoji_window_open;
  }
}
