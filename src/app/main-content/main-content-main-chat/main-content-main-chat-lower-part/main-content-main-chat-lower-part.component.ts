import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/shared-services/data.service';
import { Message } from './../../../models/message.class'
import { ChannelsService } from 'src/app/shared-services/channels.service';
import { Subscription } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { Reaction } from 'src/app/models/reaction.class';
import { User } from 'src/app/models/user.class';
import { CommonService } from 'src/app/shared-services/common.service';
import { StorageService } from 'src/app/shared-services/storage.service';
import { formatDate } from '@angular/common';
import { MessagesService } from 'src/app/shared-services/messages.service';
import { UserService } from 'src/app/shared-services/user.service';

@Component({
  selector: 'app-main-content-main-chat-lower-part',
  templateUrl: './main-content-main-chat-lower-part.component.html',
  styleUrls: ['./main-content-main-chat-lower-part.component.scss']
})
export class MainContentMainChatLowerPartComponent implements AfterViewInit {
  @ViewChild('message') input_message!: ElementRef;
  @ViewChild('img') img!: ElementRef;
  @ViewChild('chat_content') chat_content!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @HostListener('document:click', ['$event'])
  documentClickHandler(event: MouseEvent): void {
    if (this.emoji_window_messages_open && !this.isClickInsideContainer(event)) {
      this.emoji_window_messages_open = false;
    }
  }
  message = new Message();
  reaction = new Reaction();
  messageReactions: any = [];
  thread_subject: any = [];
  allUser: User[] = [];
  filteredUsers: User[] = [];
  chatMessages: any = [];
  user: User = null!;
  selectedChannel!: Channel | null;
  unsubChannels!: Subscription;
  uploadedFileLink: string | null = null;
  textAreaContent!: string;
  editedText!: string;
  textareaCols!: number;
  reactionInfoNumber!: number;
  reactionInfoMessage!: number;
  emoji_window_open: boolean = false;
  emoji_window_messages_open: boolean = false;
  hoverOptionEditMessage_open: boolean = false;
  editingMessage: boolean = false;
  errorUploadFile: boolean = false;
  mobile: boolean = false;
  reactionInfo: boolean = false;
  showUserList: boolean = false;

  constructor(
    private dataService: DataService,
    private messagesService: MessagesService,
    private channelService: ChannelsService,
    public commonService: CommonService,
    public userService: UserService
  ) {
    this.unsubChannels = this.channelService.selectedChannel$.subscribe(selectedChannel => {
      if (selectedChannel) {
        this.selectedChannel = selectedChannel;
        this.receiveChatMessages();
        this.focusInputMessage();
      }
    });

    this.messagesService.thread_subject$.subscribe((thread_subject: Message) => {
      if (thread_subject) {
        this.thread_subject = thread_subject;
        this.textAreaContent = this.thread_subject.message;
      } else {
        this.textAreaContent = '';
      }
    });

    this.channelService.currentUserInfo$.subscribe((user: User) => {
      this.user = user;
    });

    this.dataService.mobile$.subscribe((value: boolean) => {
      this.mobile = value;
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

  checkChannelCreationTime() {
    const selectedChannelTimestamp = this.getDatePartsFromFormattedDate(this.channelService.selectedChannel$.value?.timestamp.toString());
    const timestampNow = this.getDatePartsFromFormattedDate(formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en-US'));
    if (timestampNow.year == selectedChannelTimestamp.year) {
      if (timestampNow.month == selectedChannelTimestamp.month) {
        if (timestampNow.day == selectedChannelTimestamp.day) {
          return 'heute'
        } else if ((timestampNow.day - 1) == selectedChannelTimestamp.day) {
          return 'gestern'
        } else {
          return `am ${selectedChannelTimestamp.day}.${selectedChannelTimestamp.month}.${selectedChannelTimestamp.year}`
        }
      } else {
        return `am ${selectedChannelTimestamp.day}.${selectedChannelTimestamp.month}.${selectedChannelTimestamp.year}`
      }
    } else {
      return `am ${selectedChannelTimestamp.day}.${selectedChannelTimestamp.month}.${selectedChannelTimestamp.year}`
    }
  }

  checkChannelCreator() {
    if (this.selectedChannel?.creator == this.user.name) {
      return 'Du hast';
    } else {
      return `${this.selectedChannel?.creator} hat`;
    }
  }

  changedTextMessage(event: Event) {
    this.editedText = (event.target as HTMLTextAreaElement).value
  }

  setMessageInformationsForEdit() {
    const thread_subject = this.messagesService.thread_subject$.value
    const editedText = this.editedText;
    this.message.id = thread_subject.id;
    this.message.setMessage(editedText.trim());
    this.message.creator = thread_subject.creator;
    this.message.avatar = thread_subject.avatar;
    this.message.timestamp = thread_subject.timestamp;
    this.message.reactions = thread_subject.reactions;
    this.message.answered_number = thread_subject.answered_number;
    this.message.latest_answer = thread_subject.latest_answer;
  }

  async saveEditedMessage() {
    this.setMessageInformationsForEdit();
    this.messagesService.updateMessage(this.message);
    this.toggleEditing();
  }

  editMessage(text: string, i: number) {
    this.selectMessageForThread(i);
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

  private isClickInsideContainer(event: MouseEvent): boolean {
    let containerElement = document.getElementById('emoji-window-messages');
    if (containerElement) {
      return containerElement.contains(event.target as Node);
    }
    return false;
  }

  addPreSelectedReaction(emoji: string, i: number) {
    this.messagesService.selectedMessageMainChat$.next(this.chatMessages[i]);
    this.reaction.setReaction(emoji);
    this.messagesService.addReactionToMessage(this.reaction);
    this.emoji_window_messages_open = false;
  }

  addReaction($event: any) {
    this.reaction.setReaction($event.emoji.native);
    this.messagesService.addReactionToMessage(this.reaction);
    this.emoji_window_messages_open = false;
  }

  addEmoji($event: any) {
    if ($event.emoji.native !== '🫥') {
      this.input_message.nativeElement.value += $event.emoji.native;
      this.emoji_window_open = false;
    }
  }

  toggleEmojiWindowForMessage(index: number) {
    setTimeout(() => {
      this.emoji_window_messages_open = !this.emoji_window_messages_open;
    }, 50);
    this.messagesService.selectedMessageMainChat$.next(this.chatMessages[index]);
  }

  toggleEmojiWindow() {
    this.emoji_window_open = !this.emoji_window_open;
  }

  selectMessageAndOpenThread(i: number) {
    this.selectMessageForThread(i);
    this.openThread();
  }

  selectMessageForThread(index: number) {
    let counter = 0;
    try {
      const intervalId = setInterval(() => {
        this.messagesService.thread_subject$.next(this.chatMessages[index]);
        this.messagesService.thread_subject_index$.next(index);
        counter++;
        if (counter === 6) {
          clearInterval(intervalId);
        }
      }, 30);
    }
    catch {
    }
  }

  receiveChatMessages() {
    this.messagesService.updateChatMessageOfSelectedChannel();
    this.messagesService.getReactionsOfMessages();
    this.messagesService.sortChatMessagesByTime();
    this.chatMessages = this.messagesService.chatMessages;
    if (!this.dataService.thread_open$.value) {
      this.updateScroll();
    }
  }

  getFormattedTimeForLatestAnswer(latest_answer: any) {
    const timeParts = latest_answer.split(' ')[1].split(':');
    const hours = timeParts[0];
    const minutes = timeParts[1];
    return `${hours}:${minutes}`;
  }

  getFormattedTime(message: any) {
    const timeParts = message.timestamp.split(' ')[1].split(':');
    const hours = timeParts[0];
    const minutes = timeParts[1];
    return `${hours}:${minutes}`;
  }

  openThread() {
    this.dataService.thread_open$.next(true);
    if (this.mobile) {
      this.dataService.threadchat_mobile_open$.next(true);
    }
  }

  setMessageInformations() {
    const { name, id, avatar } = this.channelService.currentUserInfo$.value;
    this.message.setCreator(name);
    this.message.setCreatorId(id);
    this.message.setAvatar(avatar);
    this.message.setTimestampNow();
    this.message.setAnwers();
  }

  async sendMessageToChannel() {
    this.setMessageInformations();
    if (this.uploadedFileLink || this.input_message.nativeElement.value.trim() !== '') {
      if (this.uploadedFileLink) {
        this.message.setImg(this.uploadedFileLink);
        this.removeUploadedFile();
      } else if (this.input_message.nativeElement.value.trim() !== '') {
        const inputMessage = this.input_message.nativeElement.value.trim();
        this.message.setMessage(inputMessage);
        this.input_message.nativeElement.value = '';
      }
      await this.messagesService.pushMessageToChannel(this.message);
      this.updateScroll();
      this.message.setMessage('');
      this.message.setImg('');
    }
  }

  ngOnDestroy() {
    this.unsubChannels.unsubscribe();
  }

  async handleFileInput(event: any) {
    const input = event.target as HTMLInputElement;
    this.errorUploadFile = !this.commonService.checkFileSize(input);
    if (!this.errorUploadFile) {
      this.uploadedFileLink = await this.commonService.handleFileInput(event);
    }
  }

  removeUploadedFile() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.uploadedFileLink = null;
  }
}
