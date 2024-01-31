import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Message } from 'src/app/models/message.class';
import { Reaction } from 'src/app/models/reaction.class';
import { User } from 'src/app/models/user.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { MessagesService } from 'src/app/shared-services/messages.service';
import { CommonService } from 'src/app/shared-services/common.service';
import { StorageService } from 'src/app/shared-services/storage.service';

@Component({
  selector: 'app-main-content-thread-chat-lower-part',
  templateUrl: './main-content-thread-chat-lower-part.component.html',
  styleUrls: ['./main-content-thread-chat-lower-part.component.scss']
})
export class MainContentThreadChatLowerPartComponent {
  @ViewChild('answer') input_answer!: ElementRef; 
  @ViewChild('fileInputThread') fileInput!: ElementRef
  thread_subject: any = null;
  thread_subject_time: any;
  threadAnswers: any = [];
  answer = new Message();
  reaction = new Reaction();
  emoji_window_open: boolean = false;
  hoverOptionEditMessage_open: boolean = false;
  emoji_window_messages_open: boolean = false;
  user: User = null!;
  uploadedFileLinkThread: string | null = null;


  constructor(private channelService: ChannelsService, private messagesService: MessagesService, public commonService: CommonService, public storageService: StorageService) {
    this.messagesService.thread_subject$.subscribe((value: Message) => {
      if (value) {
        this.thread_subject_time = this.getFormattedTime(value);
        this.thread_subject = value;
      }
      this.receiveThreadAnswers();
    });

    this.channelService.currentUserInfo$.subscribe((user: User) => {
      this.user = user;
    });
  }

  @HostListener('document:click', ['$event'])
  documentClickHandler(event: MouseEvent): void {
    if (this.emoji_window_messages_open && !this.isClickInsideContainer(event)) {
      this.emoji_window_messages_open = false;
    }
  }

  private isClickInsideContainer(event: MouseEvent): boolean {
    let containerElement = document.getElementById('emoji-window-messages');

    if (containerElement) {
      return containerElement.contains(event.target as Node);
    }
    return false;
  }

  toggleHoverOptionEditMessage() {
    this.hoverOptionEditMessage_open = !this.hoverOptionEditMessage_open;
  }

  toggleEmojiWindowForMessage(index: number) {
    setTimeout(() => {
      this.emoji_window_messages_open = !this.emoji_window_messages_open;
    }, 50);
    this.messagesService.selectedAnswerThreadChat$.next(this.threadAnswers[index]);
  }

  addReaction($event: any) {
    const currentUserInfo = this.channelService.currentUserInfo$.value

    this.reaction.setReaction($event.emoji.native);
    this.reaction.setCreator(currentUserInfo.name);
    this.messagesService.addReactionToAnswer(this.reaction);
    this.emoji_window_messages_open = false;
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

  async sendAnswerToThread() {
    const { name, id, avatar } = this.channelService.currentUserInfo$.value;
    const thread_subject = this.messagesService.thread_subject$.value;
    this.answer.setCreator(name);
    this.answer.setCreatorId(id);
    this.answer.setTimestampNow();
    this.answer.setAvatar(avatar);
    if (this.uploadedFileLinkThread) {
      this.answer.setImg(this.uploadedFileLinkThread);
      this.removeUploadedFileThread();
    } else if (this.input_answer.nativeElement.value.trim() !== '') {      
      this.answer.setMessage(this.input_answer.nativeElement.value.trim());      
      this.input_answer.nativeElement.value = '';
    }
    await this.messagesService.pushThreadAnswerToMessage(this.answer);
    await this.messagesService.increaseAnswerAndSetLatestAnswer(thread_subject, this.answer);
    this.answer.setMessage('');
    this.answer.setImg('');
  }

  receiveThreadAnswers() {
    this.messagesService.updateThreadAnswersOfSelectedMessage();
    this.messagesService.getReactionsOfAnswers();
    this.messagesService.sortThreadAnswersByTime();
    this.threadAnswers = this.messagesService.threadAnswers;
  }

  getFormattedTime(message: any) {
    const timeParts = message.timestamp.split(' ')[1].split(':');
    const hours = timeParts[0];
    const minutes = timeParts[1];
    return `${hours}:${minutes}`;
  }

  async handleFileInputThread(event: any) {
    this.uploadedFileLinkThread = await this.commonService.handleFileInput(event);
  }

  removeUploadedFileThread() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.uploadedFileLinkThread = null;
  }
}
