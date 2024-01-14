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
  threadAnswers = [];
  messageReactions = [];

  // private channelsSubject = new BehaviorSubject<Channel[]>([]);
  // channels$ = this.channelsSubject.asObservable();
  // private selectedChannelSubject = new BehaviorSubject<Channel | null>(null);
  // selectedChannel$ = this.selectedChannelSubject.asObservable();

  public channels$: BehaviorSubject<Channel[]> = new BehaviorSubject<Channel[]>([]);
  public selectedChannel$: BehaviorSubject<Channel | null> = new BehaviorSubject<Channel | null>(null);
  public thread_subject$: BehaviorSubject<Message> = new BehaviorSubject<Message>(null!);
  public selectedMessageMainChat$: BehaviorSubject<Message> = new BehaviorSubject<Message>(null!);
  public currentUserInfo$: BehaviorSubject<User> = new BehaviorSubject<User>(null!);

  private unsubChannels; 

  constructor(private firestore: Firestore) {
    this.unsubChannels = this.subChannelsList();
  }

  checkReactionExistence(reaction: Reaction) {
    let messageReactions: any = this.selectedMessageMainChat$.value.reactions;

    if (messageReactions) {
      for (let i = 0; i < messageReactions.length; i++) {
        if (messageReactions[i].reaction == reaction.reaction) {
          console.log(true);
        }
      }
      console.log(false);
    } else {
      console.log(false);
    }
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

  updateChatMessageOfSelectedChannel() {
    const selectedChannel = this.selectedChannel$.value;

    onSnapshot(this.getChannelsColRef(selectedChannel!), (snapshot: any) => {
      this.chatMessages = snapshot.docs.map((doc: any) => doc.data());
    });
  }

  setSelectedChannel(channel: Channel): void {
    this.selectedChannel$.next(channel);
  }


  async addReactionToMessage(reaction: Reaction) {
    const selectedChannel = this.selectedChannel$.value;
    const selectedMessageMainChat = this.selectedMessageMainChat$.value;

    this.checkReactionExistence(reaction);

    if (selectedChannel && selectedMessageMainChat) {
      const docRef = await addDoc(this.getChannelsMessageReactionColRef(selectedChannel, selectedMessageMainChat), reaction.toJSON());
      reaction.setId(docRef.id);
      updateDoc(this.getUpdateChannelsMessageReactionColRef(selectedChannel, selectedMessageMainChat, docRef.id), reaction.toJSON())
    } else {
      console.error('No selected channel or selected message available.');
    }
  }

  async pushThreadAnswerToMessage(answer: Message): Promise<void> {
    const selectedChannel = this.selectedChannel$.value;
    const thread_subject = this.thread_subject$.value;

    answer.timestamp = formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en-US');
    if (selectedChannel && thread_subject && thread_subject !== undefined) {
      const docRef = await addDoc(this.getChannelsMessageColRef(selectedChannel, thread_subject), answer.toJSON());
      answer.setId(docRef.id);
      updateDoc(this.getUpdateChannelsMessageColRef(selectedChannel, thread_subject, docRef.id), answer.toJSON())
    } else {
      console.error('No selected channel or thread subject available.');
    }
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

  getChannelsColRef(selectedChannel: Channel) {
    return collection(this.firestore, `channels/${selectedChannel.id}/messages`);
  }

  getChannelsMessageColRef(selectedChannel: Channel, thread_subject: Message) {
    return collection(this.firestore, `channels/${selectedChannel.id}/messages/${thread_subject.id}/answers`);
  }

  getChannelsMessageReactionColRef(selectedChannel: Channel, selectedMessageMainChat: Message) {
    return collection(this.firestore, `channels/${selectedChannel.id}/messages/${selectedMessageMainChat.id}/reactions`);
  }

  getSingleDocRef(coldId: string, docID: string) {
    return doc(collection(this.firestore, coldId), docID)
  }

  ngOnDestroy() {
    this.unsubChannels();
  }
}
