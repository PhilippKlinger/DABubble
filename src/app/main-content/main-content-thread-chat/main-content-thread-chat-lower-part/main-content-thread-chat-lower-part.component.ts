import { Component, ElementRef, ViewChild } from '@angular/core';
import { Message } from 'src/app/models/message.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';

@Component({
  selector: 'app-main-content-thread-chat-lower-part',
  templateUrl: './main-content-thread-chat-lower-part.component.html',
  styleUrls: ['./main-content-thread-chat-lower-part.component.scss']
})
export class MainContentThreadChatLowerPartComponent {
  @ViewChild('answer') input_answer!: ElementRef;
  thread_subject: Message | null = null;
  threadAnswers:any = [];
  answer = new Message();
  emoji_window_open: boolean = false;

  constructor(private channelService: ChannelsService) {
    this.channelService.thread_subject$.subscribe((value: Message) => {
      //bei veränderung des observables wird folgende funktion ausgelöst
      this.thread_subject = value;
      this.receiveThreadAnswers(); 
    });
  }

  addEmoji($event: any) {
    if ($event.emoji.native !== '🫥') {
      this.input_answer.nativeElement.value += $event.emoji.native;
      //console.log($event.emoji);
      this.emoji_window_open = false;
    }
  }

  toggleEmojiWindow() {
    this.emoji_window_open = !this.emoji_window_open;
  }

  sendAnswerToThread() {
    const currentUserInfo = this.channelService.currentUserInfo$.value

    if (this.input_answer.nativeElement.value.trim() !== '') {
      this.answer.setCreator(currentUserInfo.name);
      this.answer.setTimestampNow();
      this.answer.setMessage(this.input_answer.nativeElement.value.trim());
      this.channelService.pushThreadAnswerToMessage(this.answer);
      this.input_answer.nativeElement.value = '';
    }
  }

  receiveThreadAnswers() {
    this.channelService.updateThreadAnswersOfSelectedMessage();
    this.threadAnswers = this.channelService.threadAnswers;
    console.log(this.threadAnswers);
  }
}
