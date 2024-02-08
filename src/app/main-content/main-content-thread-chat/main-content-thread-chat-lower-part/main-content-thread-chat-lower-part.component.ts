import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Message } from 'src/app/models/message.class';
import { Reaction } from 'src/app/models/reaction.class';
import { User } from 'src/app/models/user.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { MessagesService } from 'src/app/shared-services/messages.service';
import { CommonService } from 'src/app/shared-services/common.service';
import { StorageService } from 'src/app/shared-services/storage.service';
import { UserService } from 'src/app/shared-services/user.service';

@Component({
  selector: 'app-main-content-thread-chat-lower-part',
  templateUrl: './main-content-thread-chat-lower-part.component.html',
  styleUrls: ['./main-content-thread-chat-lower-part.component.scss']
})
export class MainContentThreadChatLowerPartComponent {
  @ViewChild('answer') input_answer!: ElementRef;
  @ViewChild('fileInputThread') fileInput!: ElementRef
  @ViewChild('chat_content') chat_content!: ElementRef;
  thread_subject: any = [];
  thread_subject_time: any;
  threadAnswers: Message[] = [];
  answer = new Message();
  reaction = new Reaction();
  emoji_window_open: boolean = false;
  hoverOptionEditMessage_open: boolean = false;
  emoji_window_messages_open: boolean = false;
  user: User = null!;
  uploadedFileLinkThread: string | null = null;
  errorUploadFileThread: boolean = false;
  editingMessage: boolean = false;
  textareaCols!: number;
  textAreaContent!: string;
  selectedAnswerThreadChat: any = [];
  editedText!: string;
  reactionInfo: boolean = false;
  reactionInfoNumber!: number;
  reactionInfoMessage!: number;
  allUser: User[] = [];
  filteredUsers: User[] = [];
  showUserList: boolean = false;

  constructor(private channelsService: ChannelsService, private messagesService: MessagesService, public commonService: CommonService, public storageService: StorageService, public userService: UserService) {
    this.messagesService.thread_subject$.subscribe((value: Message) => {
      if (value) {
        this.thread_subject_time = this.getFormattedTime(value);
        this.thread_subject = value;
        this.receiveThreadAnswers();
      }
    });

    this.channelsService.currentUserInfo$.subscribe((user: User) => {
      this.user = user;
    });

    this.userService.users$.subscribe(users => {
      this.allUser = users;
    });
  }

  onTextareaInput(event: any) {
    this.commonService.onTextareaInput(event, this.allUser, (filteredUsers, showUserList) => {
      this.filteredUsers = filteredUsers;
      this.showUserList = showUserList;
    });
  }

  insertUserName(userName: string) {
    this.commonService.insertUserName(userName, this.input_answer.nativeElement, this.allUser, (filteredUsers, showUserList) => {
      this.filteredUsers = filteredUsers;
      this.showUserList = showUserList;
    });
  }

  openReactionInfo(i: number, j: number) {
    this.reactionInfo = true;
    this.reactionInfoMessage = i;
    this.reactionInfoNumber = j;
  }

  closeReactionInfo() {
    this.reactionInfo = false;
  }

  updateScroll() {
    let chat = this.chat_content.nativeElement
    chat.scrollTop = chat.scrollHeight;
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

  async saveEditedMessage() {
    const selectedAnswerThreadChat = this.selectedAnswerThreadChat;
    const editedText = this.editedText;

    this.answer.id = selectedAnswerThreadChat.id;
    this.answer.setMessage(editedText.trim());
    this.answer.creator = selectedAnswerThreadChat.creator;
    this.answer.avatar = selectedAnswerThreadChat.avatar;
    this.answer.timestamp = selectedAnswerThreadChat.timestamp;
    this.answer.reactions = selectedAnswerThreadChat.reactions;
    this.answer.answered_number = selectedAnswerThreadChat.answered_number;
    this.answer.latest_answer = selectedAnswerThreadChat.latest_answer;

    this.messagesService.updateAnswer(this.answer, selectedAnswerThreadChat);
    this.toggleEditing();
  }


  changedTextMessage(event: Event) {
    this.editedText = (event.target as HTMLTextAreaElement).value
  }

  editAnswer(text: string, i: number) {
    this.textAreaContent = this.threadAnswers[i].message;
    this.selectedAnswerThreadChat = this.threadAnswers[i];
    this.updateTextareaSize(text);
    this.toggleHoverOptionEditMessage();
    setTimeout(() => {
      this.toggleEditing();
    }, 100);
  }

  updateTextareaSize(text: string) {
    const lines = text.split('\n');
    this.textareaCols = Math.max(...lines.map(line => line.length));
  }

  toggleEditing() {
    this.editingMessage = !this.editingMessage;
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
    const currentUserInfo = this.channelsService.currentUserInfo$.value

    this.reaction.setReaction($event.emoji.native);
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

  selectMessageForThread(index: number) {
    this.messagesService.thread_subject$.next(this.messagesService.chatMessages[index]);
    this.messagesService.thread_subject_index$.next(index);
  }

  async sendAnswerToThread() {
    const { name, id, avatar } = this.channelsService.currentUserInfo$.value;
    const selectedChannel = this.channelsService.selectedChannel$.value;
    const thread_subject = this.messagesService.thread_subject$.value;
    const thread_subject_index = this.messagesService.thread_subject_index$.value;

    this.answer.setCreator(name);
    this.answer.setCreatorId(id);
    this.answer.setTimestampNow();
    this.answer.setAvatar(avatar);
    if (this.uploadedFileLinkThread || this.input_answer.nativeElement.value.trim() !== '') {
      if (this.uploadedFileLinkThread) {
        this.answer.setImg(this.uploadedFileLinkThread);
        this.removeUploadedFileThread();
      } else if (this.input_answer.nativeElement.value.trim() !== '') {
        this.answer.setMessage(this.input_answer.nativeElement.value.trim());
        this.input_answer.nativeElement.value = '';
      }
      await this.messagesService.pushThreadAnswerToMessage(this.answer);
      await this.messagesService.increaseAnswerAndSetLatestAnswer(thread_subject, this.answer);
      this.updateScroll();
      this.channelsService.setSelectedChannel(selectedChannel!);
      this.selectMessageForThread(thread_subject_index!);
    }
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
    const input = event.target as HTMLInputElement;
    this.errorUploadFileThread = !this.commonService.checkFileSize(input);
    if (!this.errorUploadFileThread) {
      this.uploadedFileLinkThread = await this.commonService.handleFileInput(event);
    }
  }

  removeUploadedFileThread() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.uploadedFileLinkThread = null;
  }
}
