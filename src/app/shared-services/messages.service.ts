import { Injectable } from '@angular/core';
import { Message } from '../models/message.class';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ChannelsService } from './channels.service';
import { Firestore, addDoc, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { Reaction } from '../models/reaction.class';
import { formatDate } from '@angular/common';
import { Channel } from '../models/channel.class';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  chatMessages: any = [];
  threadAnswers: any = [];
  directMessages: any = [];
  answerReactions = [];
  messageReactions = [];
  directMessageReactions = [];
  message = new Message();

  public thread_subject$: BehaviorSubject<Message> = new BehaviorSubject<Message>(null!);
  public thread_subject_index$: BehaviorSubject<number> = new BehaviorSubject<number>(null!);
  public selectedMessageMainChat$: BehaviorSubject<Message> = new BehaviorSubject<Message>(null!);
  public selectedAnswerThreadChat$: BehaviorSubject<Message> = new BehaviorSubject<Message>(null!);

  constructor(private firestore: Firestore, private channelsService: ChannelsService, private userService: UserService) { }

  updateThreadAnswersOfSelectedMessage() {
    const selectedChannel = this.channelsService.selectedChannel$.value;
    const thread_subject = this.thread_subject$.value;

    if (selectedChannel && thread_subject) {
      onSnapshot(this.getChannelsMessageColRef(selectedChannel, thread_subject), (snapshot: any) => {
        this.threadAnswers = snapshot.docs.map((doc: any) => doc.data());
      });
    }
  }


  getReactionsOfMessages() {
    const selectedChannel = this.channelsService.selectedChannel$.value;

    for (let i = 0; i < this.chatMessages.length; i++) {
      let message = this.chatMessages[i];

      onSnapshot(this.getChannelsMessageReactionColRef(selectedChannel!, message), (snapshot: any) => {
        this.messageReactions = snapshot.docs.map((doc: any) => doc.data());
        try {
          this.chatMessages[i].reactions = this.messageReactions;
        } catch {
          console.log("couldn't set reaction to the message.")
        }
      });
    }
  }

  getReactionsOfAnswers() {
    const thread_subject = this.thread_subject$.value;
    const selectedChannel = this.channelsService.selectedChannel$.value;

    if (selectedChannel && thread_subject) {
      for (let i = 0; i < this.threadAnswers.length; i++) {
        let answer = this.threadAnswers[i];

        onSnapshot(this.getChannelsMessageAnswerReactionColRef(selectedChannel, thread_subject, answer), (snapshot: any) => {
          this.answerReactions = snapshot.docs.map((doc: any) => doc.data());
          try {
            this.threadAnswers[i].reactions = this.answerReactions;
          } catch {
            console.log("couldn't set reaction to the answer.")
          }
        });
      }
    } else {
      console.log('no selected channel or thread subject available.');
    }
  }


  updateChatMessageOfSelectedChannel() {
    const selectedChannel = this.channelsService.selectedChannel$.value;

    onSnapshot(this.channelsService.getChannelsColRef(selectedChannel!), (snapshot: any) => {
      this.chatMessages = snapshot.docs.map((doc: any) => doc.data());
    });
  }

  async updateDirectMessages() {
    const dm_user = this.userService.dm_user$.value;
    const currentUserInfo = this.channelsService.currentUserInfo$.value;
    if (dm_user) {

      onSnapshot(this.userService.getUsersDMConversationRef(dm_user, ((await this.userService.findConversation(dm_user, currentUserInfo)).docId)), (snapshot: any) => {
        this.directMessages = snapshot.docs.map((doc: any) => doc.data());
      });
    }
    console.log(this.directMessages);
  }

  refreshThreadSubject() {
    const thread_subject = this.thread_subject$.value;
    if (thread_subject) {
      this.thread_subject$.next(thread_subject);
    }
  }

  checkReactionExistenceOnMessage(reaction: Reaction) {
    let messageReactions: any = this.selectedMessageMainChat$.value.reactions;

    if (messageReactions) {
      for (let i = 0; i < messageReactions.length; i++) {
        if (messageReactions[i].reaction == reaction.reaction) {
          return { exists: true, amount: messageReactions[i].amount, id: messageReactions[i].id }
        }
      }
      return { exists: false, amount: -1, id: null };
    } else {
      return { exists: false, amount: -1, id: null };
    }
  }

  checkReactionExistenceOnAnswer(reaction: Reaction) {
    let answerReactions: any = this.selectedAnswerThreadChat$.value.reactions;

    if (answerReactions) {
      for (let i = 0; i < answerReactions.length; i++) {
        if (answerReactions[i].reaction == reaction.reaction) {
          return { exists: true, amount: answerReactions[i].amount, id: answerReactions[i].id }
        }
      }
      return { exists: false, amount: -1, id: null };
    } else {
      return { exists: false, amount: -1, id: null };
    }
  }

  sortDirectMessagesByTime() {
    this.directMessages.sort((a: any, b: any) => {
      const timeA = this.parseDate(a.timestamp);
      const timeB = this.parseDate(b.timestamp);
      return timeA - timeB;
    });
  }

  sortChatMessagesByTime() {
    this.chatMessages.sort((a: any, b: any) => {
      const timeA = this.parseDate(a.timestamp);
      const timeB = this.parseDate(b.timestamp);
      return timeA - timeB;
    });
  }

  sortThreadAnswersByTime() {
    this.threadAnswers.sort((a: any, b: any) => {
      const timeA = this.parseDate(a.timestamp);
      const timeB = this.parseDate(b.timestamp);
      return timeA - timeB;
    });
  }

  parseDate(timestamp: any) {
    const dateParts = timestamp.split(' ')[0].split('-');
    const timeParts = timestamp.split(' ')[1].split(':');
    const secondsParts = timeParts[2].split(':'); // Neues Array für Sekunden hinzufügen

    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Monate in JavaScript sind 0-basiert
    const day = parseInt(dateParts[0], 10);
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(secondsParts[0], 10);

    return new Date(year, month, day, hours, minutes, seconds).getTime();
  }

  async addReactionToAnswer(reaction: Reaction) {
    const selectedChannel = this.channelsService.selectedChannel$.value;
    const thread_subject = this.thread_subject$.value;
    const selectedAnswerThreadChat = this.selectedAnswerThreadChat$.value;
    let result = this.checkReactionExistenceOnAnswer(reaction);

    if (selectedChannel && thread_subject && selectedAnswerThreadChat) {
      if (result.exists) {
        let reaction_amount = result.amount + 1;
        reaction.setAmount(reaction_amount);
        console.log(reaction_amount);
        await updateDoc(this.getUpdateChannelsMessageAnswerReactionColRef(selectedChannel, thread_subject, selectedAnswerThreadChat, result.id), reaction.toJSON());
      } else {
        reaction.setAmount(1);
        const docRef = await addDoc(this.getChannelsMessageAnswerReactionColRef(selectedChannel, thread_subject, selectedAnswerThreadChat), reaction.toJSON());
        reaction.setId(docRef.id);
        console.log(docRef.id);
        await updateDoc(this.getUpdateChannelsMessageAnswerReactionColRef(selectedChannel, thread_subject, selectedAnswerThreadChat, docRef.id), reaction.toJSON());
      }
    } else {
      console.error('No selected channel or selected message available.');
    }
    this.refreshThreadSubject();
  }

  async addReactionToMessage(reaction: Reaction) {
    const selectedChannel = this.channelsService.selectedChannel$.value;
    const selectedMessageMainChat = this.selectedMessageMainChat$.value;
    let result = this.checkReactionExistenceOnMessage(reaction);

    if (selectedChannel && selectedMessageMainChat) {
      if (result.exists) {
        let reaction_amount = result.amount + 1;
        reaction.setAmount(reaction_amount);
        console.log(reaction_amount);
        await updateDoc(this.getUpdateChannelsMessageReactionColRef(selectedChannel, selectedMessageMainChat, result.id), reaction.toJSON());
      } else {
        reaction.setAmount(1);
        const docRef = await addDoc(this.getChannelsMessageReactionColRef(selectedChannel, selectedMessageMainChat), reaction.toJSON());
        reaction.setId(docRef.id);
        console.log(docRef.id);
        await updateDoc(this.getUpdateChannelsMessageReactionColRef(selectedChannel, selectedMessageMainChat, docRef.id), reaction.toJSON());
      }
    } else {
      console.error('No selected channel or selected message available.');
    }
    this.channelsService.setSelectedChannel(selectedChannel!);
  }

  selectMessageForThread(index: number) {
    this.thread_subject$.next(this.chatMessages[index]);
    this.thread_subject_index$.next(index);
  }


  async pushThreadAnswerToMessage(answer: Message): Promise<void> {
    const selectedChannel = this.channelsService.selectedChannel$.value;
    const thread_subject = this.thread_subject$.value;
    const thread_subject_index = this.thread_subject_index$.value;

    answer.timestamp = formatDate(new Date(), 'dd-MM-yyyy HH:mm:ss', 'en-US');
    if (selectedChannel && thread_subject && thread_subject !== undefined) {
      const docRef = await addDoc(this.getChannelsMessageColRef(selectedChannel, thread_subject), answer.toJSON());
      answer.setId(docRef.id);
      updateDoc(this.getUpdateChannelsMessageColRef(selectedChannel, thread_subject, docRef.id), answer.toJSON())
    } else {
      console.error('No selected channel or thread subject available.');
    }
    this.channelsService.setSelectedChannel(selectedChannel!);
    this.selectMessageForThread(thread_subject_index!);
  }

  async pushMessageToChannel(message: Message): Promise<void> {
    const selectedChannel = this.channelsService.selectedChannel$.value;

    message.timestamp = formatDate(new Date(), 'dd-MM-yyyy HH:mm:ss', 'en-US');
    //try and catch besser ??
    if (selectedChannel) {
      const docRef = await addDoc(this.channelsService.getChannelsColRef(selectedChannel), message.toJSON());
      message.setId(docRef.id);
      await updateDoc(this.channelsService.getUpdatedChannelsColRef(selectedChannel, docRef.id), message.toJSON());
      // console.log(docRef.id)
    } else {
      console.error('No selected channel available.');
    }

    this.channelsService.setSelectedChannel(selectedChannel!);
  }

  async increaseAnswerAndSetLatestAnswer(thread_subject: Message, answer: Message) {
    const selectedChannel = this.channelsService.selectedChannel$.value;
    if (selectedChannel) {
      this.message.timestamp = thread_subject.timestamp;
      this.message.message = thread_subject.message;
      this.message.id = thread_subject.id;
      this.message.creator = thread_subject.creator;
      this.message.avatar = thread_subject.avatar;
      this.message.reactions = thread_subject.reactions;
      this.message.answered_number = (thread_subject.answered_number + 1);
      this.message.setLatestAnswer(answer.timestamp);
      await updateDoc(this.channelsService.getUpdatedChannelsColRef(selectedChannel, thread_subject.id), this.message.toJSON());
    }
    console.log(this.message.latest_answer);
  }

  async updateMessage(message: Message) {
    const selectedChannel = this.channelsService.selectedChannel$.value;
    const docRef = this.thread_subject$.value;

    await updateDoc(this.channelsService.getUpdatedChannelsColRef(selectedChannel!, docRef.id), message.toJSON());
    this.channelsService.setSelectedChannel(selectedChannel!);
  }

  getUpdateChannelsMessageColRef(selectedChannel: Channel, thread_subject: Message, id: string) {
    return doc(this.firestore, `channels/${selectedChannel.id}/messages/${thread_subject.id}/answers/${id}`);
  }

  getUpdateChannelsMessageReactionColRef(selectedChannel: Channel, selectedMessageMainChat: Message, id: string) {
    return doc(this.firestore, `channels/${selectedChannel.id}/messages/${selectedMessageMainChat.id}/reactions/${id}`);
  }

  getUpdateChannelsMessageAnswerReactionColRef(selectedChannel: Channel, thread_subject: Message, selectedAnswerThreadChat: Message, id: string) {
    return doc(this.firestore, `channels/${selectedChannel.id}/messages/${thread_subject.id}/answers/${selectedAnswerThreadChat.id}/reactions/${id}`);
  }

  getChannelsMessageColRef(selectedChannel: Channel, thread_subject: Message) {
    return collection(this.firestore, `channels/${selectedChannel.id}/messages/${thread_subject.id}/answers`);
  }

  getChannelsMessageReactionColRef(selectedChannel: Channel, selectedMessageMainChat: Message) {
    return collection(this.firestore, `channels/${selectedChannel.id}/messages/${selectedMessageMainChat.id}/reactions`);
  }

  getChannelsMessageAnswerReactionColRef(selectedChannel: Channel, thread_subject: Message, selectedAnswerThreadChat: Message) {
    return collection(this.firestore, `channels/${selectedChannel.id}/messages/${thread_subject.id}/answers/${selectedAnswerThreadChat.id}/reactions`);
  }
}
