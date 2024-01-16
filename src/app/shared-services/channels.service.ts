import { Injectable } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, DocumentData, getDoc } from '@angular/fire/firestore';
import { Channel } from '../models/channel.class';
import { BehaviorSubject } from 'rxjs';
import { formatDate } from '@angular/common';
import { Message } from '../models/message.class';
import { Reaction } from '../models/reaction.class';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {
  chatMessages: any = [];
  threadAnswers: any = [];
  answerReactions = [];
  messageReactions = [];
  message = new Message();

  // private channelsSubject = new BehaviorSubject<Channel[]>([]);
  // channels$ = this.channelsSubject.asObservable();
  // private selectedChannelSubject = new BehaviorSubject<Channel | null>(null);
  // selectedChannel$ = this.selectedChannelSubject.asObservable();

  public channels$: BehaviorSubject<Channel[]> = new BehaviorSubject<Channel[]>([]);
  public selectedChannel$: BehaviorSubject<Channel | null> = new BehaviorSubject<Channel | null>(null);
  public thread_subject$: BehaviorSubject<Message> = new BehaviorSubject<Message>(null!);
  public thread_subject_index$: BehaviorSubject<number> = new BehaviorSubject<number>(null!);
  public selectedMessageMainChat$: BehaviorSubject<Message> = new BehaviorSubject<Message>(null!);
  public selectedAnswerThreadChat$: BehaviorSubject<Message> = new BehaviorSubject<Message>(null!);
  public currentUserInfo$: BehaviorSubject<User> = new BehaviorSubject<User>(null!);

  private unsubChannels;

  constructor(private firestore: Firestore) {
    this.unsubChannels = this.subChannelsList();
  }

  updateThreadAnswersOfSelectedMessage() {
    const selectedChannel = this.selectedChannel$.value;
    const thread_subject = this.thread_subject$.value;

    if (selectedChannel && thread_subject) {
      onSnapshot(this.getChannelsMessageColRef(selectedChannel, thread_subject), (snapshot: any) => {
        this.threadAnswers = snapshot.docs.map((doc: any) => doc.data());
      });
    }
  }

  getReactionsOfMessages() {
    const selectedChannel = this.selectedChannel$.value;

    for (let i = 0; i < this.chatMessages.length; i++) {
      let message = this.chatMessages[i];

      onSnapshot(this.getChannelsMessageReactionColRef(selectedChannel!, message), (snapshot: any) => {
        this.messageReactions = snapshot.docs.map((doc: any) => doc.data());
        this.chatMessages[i].reactions = this.messageReactions;
      });
    }
  }

  getReactionsOfAnswers() {
    const thread_subject = this.thread_subject$.value;
    const selectedChannel = this.selectedChannel$.value;

    if (selectedChannel && thread_subject) {
      for (let i = 0; i < this.threadAnswers.length; i++) {
        let answer = this.threadAnswers[i];

        onSnapshot(this.getChannelsMessageAnswerReactionColRef(selectedChannel, thread_subject, answer), (snapshot: any) => {
          this.answerReactions = snapshot.docs.map((doc: any) => doc.data());
          this.threadAnswers[i].reactions = this.answerReactions;
        });
      }
    } else {
      console.log('no selected channel or thread subject available.');
    }
  }

  updateChatMessageOfSelectedChannel() {
    const selectedChannel = this.selectedChannel$.value;

    onSnapshot(this.getChannelsColRef(selectedChannel!), (snapshot: any) => {
      this.chatMessages = snapshot.docs.map((doc: any) => doc.data());
    });
  }

  refreshThreadSubject() {
    const thread_subject = this.thread_subject$.value;
    if (thread_subject) {
      this.thread_subject$.next(thread_subject);
    }
  }

  setSelectedChannel(channel: Channel): void {
    this.selectedChannel$.next(channel);
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
    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Monate in JavaScript sind 0-basiert
    const day = parseInt(dateParts[0], 10);
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    return new Date(year, month, day, hours, minutes).getTime();
  }

  async addReactionToAnswer(reaction: Reaction) {
    const selectedChannel = this.selectedChannel$.value;
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
    const selectedChannel = this.selectedChannel$.value;
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
    this.setSelectedChannel(selectedChannel!);
  }

  selectMessageForThread(index: number) {
    this.thread_subject$.next(this.chatMessages[index]);
    this.thread_subject_index$.next(index);
  }


  async pushThreadAnswerToMessage(answer: Message): Promise<void> {
    const selectedChannel = this.selectedChannel$.value;
    const thread_subject = this.thread_subject$.value;
    const thread_subject_index = this.thread_subject_index$.value;

    answer.timestamp = formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en-US');
    if (selectedChannel && thread_subject && thread_subject !== undefined) {
      const docRef = await addDoc(this.getChannelsMessageColRef(selectedChannel, thread_subject), answer.toJSON());
      answer.setId(docRef.id);
      updateDoc(this.getUpdateChannelsMessageColRef(selectedChannel, thread_subject, docRef.id), answer.toJSON())
    } else {
      console.error('No selected channel or thread subject available.');
    }
    this.setSelectedChannel(selectedChannel!);
    this.selectMessageForThread(thread_subject_index!);
  }

  async pushMessageToChannel(message: Message): Promise<void> {
    const selectedChannel = this.selectedChannel$.value;

    message.timestamp = formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en-US');
    //try and catch besser ??
    if (selectedChannel) {
      const docRef = await addDoc(this.getChannelsColRef(selectedChannel), message.toJSON());
      message.setId(docRef.id);
      await updateDoc(this.getUpdatedChannelsColRef(selectedChannel, docRef.id), message.toJSON());
      // console.log(docRef.id)
    } else {
      console.error('No selected channel available.');
    }

    this.setSelectedChannel(selectedChannel!);
  }

  async increaseAnswerAndSetLatestAnswer(thread_subject: Message, answer: Message) {
    const selectedChannel = this.selectedChannel$.value;
    if (selectedChannel) {
      this.message.timestamp = thread_subject.timestamp;
      this.message.message = thread_subject.message;
      this.message.id = thread_subject.id;
      this.message.creator = thread_subject.creator;
      this.message.avatar = thread_subject.avatar;
      this.message.reactions = thread_subject.reactions;
      this.message.answered_number = (thread_subject.answered_number + 1);
      this.message.setLatestAnswer(answer.timestamp);
      await updateDoc(this.getUpdatedChannelsColRef(selectedChannel, thread_subject.id), this.message.toJSON());
    }
    console.log(this.message.latest_answer);
  }

  async createChannel(channel: Channel, colId: 'channels'): Promise<void> {
    const collectionRef = collection(this.firestore, colId);
    channel.timestamp = formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en-US');
    try {
      const docRef = await addDoc(collectionRef, channel.toJSON());
      channel.id = docRef.id;
      this.updateChannel(channel);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  subChannelsList() {
    return onSnapshot(this.getChannelsRef(), (querySnapshot) => {
      const channels = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Channel;
        return new Channel({ ...data, id: doc.id });
      });
      //hier entweder bestimmten channel auswählen oder zuletzt besuchten channel anzeigen
      // if (channels.length > 0) {
      //   const firstChannel = channels[0];
      //   this.setSelectedChannel(firstChannel);
      // }

      this.channels$.next(channels);
    });
  }

  async deleteChannel(colId: string, docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (error) => {
        console.error(error)
      }
    )
  }

  async updateChannel(channel: Channel | null) {
    if (channel && channel.id) {
      let docRef = this.getSingleDocRef('channels', channel.id);
      await updateDoc(docRef, channel.toJSON()).catch(
        (err) => {
          console.log(err);
        }
      );
    }
  }

  async updateMessage(message: Message) {
    const selectedChannel = this.selectedChannel$.value;
    const docRef = this.thread_subject$.value;

    await updateDoc(this.getUpdatedChannelsColRef(selectedChannel!, docRef.id), message.toJSON());
    this.setSelectedChannel(selectedChannel!);
  }

  getChannelsRef() {
    return collection(this.firestore, 'channels');
  }

  getUpdatedChannelsColRef(selectedChannel: Channel, id: string) {
    return doc(this.firestore, `channels/${selectedChannel.id}/messages/${id}`);
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

  getChannelsColRef(selectedChannel: Channel) {
    return collection(this.firestore, `channels/${selectedChannel.id}/messages`);
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

  getSingleDocRef(coldId: string, docID: string) {
    return doc(collection(this.firestore, coldId), docID)
  }

  ngOnDestroy() {
    this.unsubChannels();
  }
}
