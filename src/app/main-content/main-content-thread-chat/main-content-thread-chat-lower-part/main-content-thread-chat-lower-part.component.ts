import { Component, ElementRef, ViewChild } from '@angular/core';
import { Message } from 'src/app/models/message.class';
import { Reaction } from 'src/app/models/reaction.class';
import { User } from 'src/app/models/user.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';

@Component({
  selector: 'app-main-content-thread-chat-lower-part',
  templateUrl: './main-content-thread-chat-lower-part.component.html',
  styleUrls: ['./main-content-thread-chat-lower-part.component.scss']
})
export class MainContentThreadChatLowerPartComponent {
  @ViewChild('answer') input_answer!: ElementRef;
  thread_subject: Message | null = null;
  threadAnswers: any = [];
  answer = new Message();
  reaction = new Reaction();
  emoji_window_open: boolean = false;
  hoverOptionEditMessage_open: boolean = false;
  emoji_window_messages_open: boolean = false;
  chatMessages: any = [];
  user: User = null!;

  constructor(private channelService: ChannelsService) {
    this.channelService.thread_subject$.subscribe((value: Message) => {
      //bei veränderung des observables wird folgende funktion ausgelöst
      this.thread_subject = value;
      this.receiveThreadAnswers();
    });

    this.channelService.currentUserInfo$.subscribe((user: User) => {
      this.user = user;
    });
  }

  addReaction($event: any) {
    const currentUserInfo = this.channelService.currentUserInfo$.value
    
    this.reaction.setReaction($event.emoji.native);
    this.reaction.setCreator(currentUserInfo.name);
    this.channelService.addReactionToMessage(this.reaction);
    this.emoji_window_messages_open = false;
  }

  toggleHoverOptionEditMessage() {
    this.hoverOptionEditMessage_open = !this.hoverOptionEditMessage_open;
  }

  toggleEmojiWindowForMessage(index: number) {
    setTimeout(() => {
      this.emoji_window_messages_open = !this.emoji_window_messages_open;
    }, 50);
    this.channelService.selectedMessageMainChat$.next(this.chatMessages[index]);
  }

  addEmoji($event: any) {
    if ($event.emoji.native !== '🫥') {
      this.input_answer.nativeElement.value += $event.emoji.native;
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
      this.answer.setAvatar(currentUserInfo.avatar);
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
