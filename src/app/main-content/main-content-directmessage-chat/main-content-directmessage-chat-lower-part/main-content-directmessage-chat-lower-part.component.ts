import { formatDate } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
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
  styleUrls: ['./main-content-directmessage-chat-lower-part.component.scss']
})
export class MainContentDirectmessageChatLowerPartComponent {
  @ViewChild('message') input_message!: ElementRef;
  emoji_window_open: boolean = false;
  emoji_window_messages_open: boolean = false;
  message = new Message();
  reaction = new Reaction();
  chatMessages: any = [];
  user: User = null!;
  dm_user: User | null = null!
  thread_subject: any = [];
  editingMessage: boolean = false;
  editedText!: string;
  textareaCols!: number;
  textAreaContent!: string;
  hoverOptionEditMessage_open: boolean = false;


  constructor(public commonService: CommonService, private channelService: ChannelsService, private messagesService: MessagesService, private userService: UserService) {
    this.userService.dm_user$.subscribe((dm_user) => {
      this.dm_user = dm_user;
    });
  }


  editMessage(text: string) {
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
    setTimeout(() => {
      this.emoji_window_messages_open = !this.emoji_window_messages_open;
    }, 50);
    this.messagesService.selectedMessageMainChat$.next(this.chatMessages[index]);
  }

  async saveEditedMessage() {
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

    this.messagesService.updateMessage(this.message);
    this.toggleEditing();
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
    let month = parseInt(dayMonthYear[1], 10) - 1; // Monate im JavaScript Date-Objekt sind 0-basiert
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

  addReaction($event: any) {
    const currentUserInfo = this.channelService.currentUserInfo$.value

    this.reaction.setReaction($event.emoji.native);
    this.reaction.setCreator(currentUserInfo.name);
    this.messagesService.addReactionToMessage(this.reaction);
    this.emoji_window_messages_open = false;
  }

  addEmoji($event: any) {
    if ($event.emoji.native !== '🫥') {
      this.input_message.nativeElement.value += $event.emoji.native;
      //console.log($event.emoji);
      this.emoji_window_open = false;
    }
  }

  sendMessageToUser() {
    const currentUserInfo = this.channelService.currentUserInfo$.value

    if (this.input_message.nativeElement.value.trim() !== '') {
      this.message.setCreator(currentUserInfo.name);
      this.message.setAvatar(currentUserInfo.avatar);
      this.message.setTimestampNow();
      this.message.setAnwers();
      /* debugger
      if (this.uploadedFileLink) {
        const messageWithLink = this.input_message.nativeElement.value.trim() + "\nDatei: " + this.uploadedFileLink;
        this.message.setMessage(messageWithLink);
      } else { */
      this.message.setMessage(this.input_message.nativeElement.value.trim());
      /*  }    */
      this.userService.pushMessageToUser(this.message);
      this.input_message.nativeElement.value = '';
    }
  }
}
