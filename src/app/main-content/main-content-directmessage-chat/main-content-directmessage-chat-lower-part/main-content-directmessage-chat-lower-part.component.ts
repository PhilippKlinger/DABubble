import { formatDate } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DMInfo } from 'src/app/models/DMInfo.class';
import { Message } from 'src/app/models/message.class';
import { Reaction } from 'src/app/models/reaction.class';
import { User } from 'src/app/models/user.class';
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { CommonService } from 'src/app/shared-services/common.service';
import { MessagesService } from 'src/app/shared-services/messages.service';
import { UserService } from 'src/app/shared-services/user.service';

@Component({
  selector: 'app-main-content-directmessage-chat-lower-part',
  templateUrl: './main-content-directmessage-chat-lower-part.component.html',
  styleUrls: ['./main-content-directmessage-chat-lower-part.component.scss',
    '../../../dialogs/dialog-show-channelmembers/dialog-show-channelmembers.component.scss']
})
export class MainContentDirectmessageChatLowerPartComponent implements AfterViewInit {
  @ViewChild('message') input_message!: ElementRef;
  @ViewChild('fileInputDirect') fileInput!: ElementRef
  @ViewChild('chat_content') chat_content!: ElementRef;
  message = new Message();
  reaction = new Reaction();
  chatMessages: any = [];
  directMessages: any = [];
  thread_subject: any = [];
  selectedDirectMessage: any = [];
  allUser: User[] = [];
  filteredUsers: User[] = [];
  uploadedFileLinkDirect: string | null = null;
  editedText!: string;
  textAreaContent!: string;
  textareaCols!: number;
  reactionInfoNumber!: number;
  reactionInfoMessage!: number;
  dm_user: User | null = null!
  user: User = null!;
  emoji_window_open: boolean = false;
  emoji_window_messages_open: boolean = false;
  editingMessage: boolean = false;
  hoverOptionEditMessage_open: boolean = false;
  errorUploadFileDirect: boolean = false;
  reactionInfo: boolean = false;
  showUserList: boolean = false;

  constructor(public commonService: CommonService,
    private channelService: ChannelsService,
    private messagesService: MessagesService,
    private userService: UserService) {
    this.messagesService.dm_user$.subscribe((dm_user) => {
      if (dm_user) {
        this.dm_user = dm_user;
        this.receiveDirectMessages();
        this.focusInputMessage();
      } else {
      }
    });

    this.channelService.currentUserInfo$.subscribe((user: User) => {
      this.user = user;
    });

    this.messagesService.selectedDirectMessage$.subscribe((message: Message) => {
      this.selectedDirectMessage = message;
    });

    this.userService.users$.subscribe(users => {
      this.allUser = users;
    });
  }

  ngAfterViewInit(): void {
    this.focusInputMessage();
  }

  focusInputMessage(): void {
    this.input_message.nativeElement.focus();
  }

  onTextareaInput(event: any) {
    this.commonService.onTextareaInput(event, this.allUser, (filteredUsers, showUserList) => {
      this.filteredUsers = filteredUsers;
      this.showUserList = showUserList;
    });
  }

  insertUserName(userName: string) {
    this.commonService.insertUserName(userName, this.input_message.nativeElement, this.allUser, (filteredUsers, showUserList) => {
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
    setTimeout(() => {
      this.chat_content.nativeElement.scrollTop = this.chat_content.nativeElement.scrollHeight;
    }, 0);
  }

  async receiveDirectMessages() {
    const dm_user = this.messagesService.dm_user$.value;
    const currentUserInfo = this.channelService.currentUserInfo$.value;

    if ((await this.messagesService.findConversation(dm_user!, currentUserInfo)).available) {
      await this.messagesService.updateDirectMessages();
      await this.messagesService.getReactionsOfDirectMessages();
      this.messagesService.sortDirectMessagesByTime();
      this.chatMessages = this.messagesService.directMessages;
      this.updateScroll();
    } else {
      this.chatMessages = [];
    }
  }

  editMessage(text: string, i: number) {
    this.selectedDirectMessage = this.chatMessages[i];
    this.textAreaContent = this.chatMessages[i].message;
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

  toggleHoverOptionEditMessage() {
    this.hoverOptionEditMessage_open = !this.hoverOptionEditMessage_open;
  }

  toggleEmojiWindowForMessage(index: number) {
    this.selectDirectMessage(index);
    setTimeout(() => {
      this.emoji_window_messages_open = !this.emoji_window_messages_open;
    }, 50);
  }

  selectDirectMessage(index: number) {
    this.messagesService.selectedDirectMessage$.next(this.chatMessages[index]);
  }

  async saveEditedMessage() {
    const selectedDirectMessage = this.selectedDirectMessage
    this.messagesService.selectedDirectMessage$.next(selectedDirectMessage);
    this.setMessageInformationsForEdit();
    this.messagesService.updateDirectMessage(this.message, selectedDirectMessage);
    this.toggleEditing();
  }

  setMessageInformationsForEdit() {
    const selectedDirectMessage = this.selectedDirectMessage
    const editedText = this.editedText;
    this.message.id = selectedDirectMessage.id;
    this.message.setMessage(editedText.trim());
    this.message.creator = selectedDirectMessage.creator;
    this.message.avatar = selectedDirectMessage.avatar;
    this.message.timestamp = selectedDirectMessage.timestamp;
    this.message.reactions = selectedDirectMessage.reactions;
    this.message.answered_number = selectedDirectMessage.answered_number;
    this.message.latest_answer = selectedDirectMessage.latest_answer;
  }

  toggleEditing() {
    this.editingMessage = !this.editingMessage;
  }

  changedTextMessage(event: Event) {
    this.editedText = (event.target as HTMLTextAreaElement).value
  }

  extractWeekdayAndMonth(date?: string): { weekday: string, month: string } {
    const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    let dateParts = (date ?? '').split(' ');
    let dayMonthYear = dateParts[0].split('-');
    let time = dateParts[1].split(':');
    let day = parseInt(dayMonthYear[0], 10);
    let month = parseInt(dayMonthYear[1], 10) - 1;
    let year = parseInt(dayMonthYear[2], 10);
    let hour = parseInt(time[0], 10);
    let minute = parseInt(time[1], 10);
    let dateObject = new Date(year, month, day, hour, minute);
    let weekdayIndex = dateObject.getDay();
    let monthIndex = dateObject.getMonth();
    let weekday = weekdays[weekdayIndex];
    let monthName = months[monthIndex];
    return { weekday, month: monthName };
  }

  returnPartingLineValue(index: number): { text: string, boolean: boolean } {
    let chatMessages = this.chatMessages;
    let currentMessageTimestamp = this.getDatePartsFromFormattedDate(chatMessages[index].timestamp);
    let currentMessageWeekdayAndMonth = this.extractWeekdayAndMonth(chatMessages[index].timestamp);

    if (chatMessages[index - 1]) {
      let previousMessageTimestamp = this.getDatePartsFromFormattedDate(chatMessages[index - 1].timestamp);
      let lastMessageTimestamp = this.getDatePartsFromFormattedDate(chatMessages[chatMessages.length - 1].timestamp);
      let today = formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en-US');
      let todayTimestamp = this.getDatePartsFromFormattedDate(today);

      if (currentMessageTimestamp.year == previousMessageTimestamp.year) {
        if (currentMessageTimestamp.month == previousMessageTimestamp.month) {
          if (currentMessageTimestamp.day == previousMessageTimestamp.day) {
            //der selbe tag
            return {
              'text': `nicht verfügbar`,
              'boolean': false,
            };
          } else if (currentMessageTimestamp.day == todayTimestamp.day) {
            //heute
            return {
              'text': `Heute`,
              'boolean': true,
            };
          } else if (lastMessageTimestamp.day - 1 == currentMessageTimestamp.day) {
            //gesetern
            return {
              'text': `Gestern`,
              'boolean': true,
            };
          } else {
            // Dieser Monat aber nicht der selbe Tag
            return {
              'text': `${currentMessageWeekdayAndMonth.weekday}, ${currentMessageTimestamp.day}. ${currentMessageWeekdayAndMonth.month}`,
              'boolean': true,
            };
          }
        } else {
          //nicht dieser Monat
          return {
            'text': `${currentMessageWeekdayAndMonth.weekday}, ${currentMessageTimestamp.day}. ${currentMessageWeekdayAndMonth.month}`,
            'boolean': true,
          };
        }
      } else {
        //nicht dieses Jahr
        return {
          'text': `${currentMessageWeekdayAndMonth.weekday}, ${currentMessageTimestamp.day}. ${currentMessageWeekdayAndMonth.month}, ${currentMessageTimestamp.year}`,
          'boolean': true,
        };
      }
    }
    else {
      // keine vorherige nachricht verfügbar
      return {
        'text': `${currentMessageWeekdayAndMonth.weekday}, ${currentMessageTimestamp.day}. ${currentMessageWeekdayAndMonth.month}, ${currentMessageTimestamp.year}`,
        'boolean': true,
      };
    }
  }

  getDatePartsFromFormattedDate(formattedDate?: string): { day: number, month: number, year: number } {
    const parts = (formattedDate ?? '').split(' ')[0].split('-');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    return { day, month, year };
  }

  getFormattedTime(message: any) {
    const timeParts = message.timestamp.split(' ')[1].split(':');
    const hours = timeParts[0];
    const minutes = timeParts[1];
    return `${hours}:${minutes}`;
  }

  selectMessageForThread(index: number) {
    let counter = 0;
    const intervalId = setInterval(() => {
      this.messagesService.thread_subject$.next(this.chatMessages[index]);
      this.messagesService.thread_subject_index$.next(index);
      counter++;

      if (counter === 6) {
        clearInterval(intervalId); // Stoppt das Intervall, nachdem es dreimal aufgerufen wurde
      }
    }, 30);
  }

  toggleEmojiWindow() {
    this.emoji_window_open = !this.emoji_window_open;
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

  addReaction($event: any) {
    this.reaction.setReaction($event.emoji.native);
    this.messagesService.addReactionToDM(this.reaction);
    this.emoji_window_messages_open = false;
  }

  addEmoji($event: any) {
    if ($event.emoji.native !== '🫥') {
      this.input_message.nativeElement.value += $event.emoji.native;
      this.emoji_window_open = false;
    }
  }

  setMessageInformations() {
    const { name, avatar } = this.channelService.currentUserInfo$.value
    this.message.setCreator(name);
    this.message.setAvatar(avatar);
    this.message.setTimestampNow();
    this.message.setAnwers();
  }

  async sendMessageToUser() {
    this.setMessageInformations();
    if (this.uploadedFileLinkDirect || this.input_message.nativeElement.value.trim() !== '') {
      if (this.uploadedFileLinkDirect) {
        this.message.setImg(this.uploadedFileLinkDirect);
        this.removeUploadedFileDirect();
      } else if (this.input_message.nativeElement.value.trim() !== '') {
        this.message.setMessage(this.input_message.nativeElement.value.trim());
        this.input_message.nativeElement.value = '';
      }
      await this.messagesService.pushMessageToUser(this.message);
      this.updateScroll()
      this.message.setMessage('');
      this.message.setImg('');
    }
  }

  async handleFileInputDirect(event: any) {
    const input = event.target as HTMLInputElement;
    this.errorUploadFileDirect = !this.commonService.checkFileSize(input);
    if (!this.errorUploadFileDirect) {
      this.uploadedFileLinkDirect = await this.commonService.handleFileInput(event);
    }
  }

  removeUploadedFileDirect() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.uploadedFileLinkDirect = null;
  }
}
