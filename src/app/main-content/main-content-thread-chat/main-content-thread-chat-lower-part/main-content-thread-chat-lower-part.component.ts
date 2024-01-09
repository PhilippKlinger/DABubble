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
  // thread_subject: Message = null!;
  thread_subject: Message | null = null;

  threadAnswers:any = [];
  answer = new Message();
  constructor(private channelService: ChannelsService) {
    this.channelService.thread_subject$.subscribe((value: Message) => {
      //bei veränderung des observables wird folgende funktion ausgelöst
      this.thread_subject = value;
      this.receiveThreadAnswers(); 
    });
  }

  sendAnswerToThread() {
    if (this.input_answer.nativeElement.value.trim() !== '') {
      this.answer.setCreator();
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
