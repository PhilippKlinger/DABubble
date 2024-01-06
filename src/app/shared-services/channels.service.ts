import { Injectable } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, DocumentData, getDoc } from '@angular/fire/firestore';
import { Channel } from '../models/channel.class';
import { BehaviorSubject } from 'rxjs';
import { formatDate } from '@angular/common';
import { Message } from '../models/message.class';

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {
  chatMessages = [];
  threadAnswers = [];

  // private channelsSubject = new BehaviorSubject<Channel[]>([]);
  // channels$ = this.channelsSubject.asObservable();
  // private selectedChannelSubject = new BehaviorSubject<Channel | null>(null);
  // selectedChannel$ = this.selectedChannelSubject.asObservable();
  
  
  public channels$: BehaviorSubject<Channel[]> = new BehaviorSubject<Channel[]>([]);
  public selectedChannel$: BehaviorSubject<Channel | null> = new BehaviorSubject<Channel | null>(null);
  public thread_subject$: BehaviorSubject<Message> = new BehaviorSubject<Message>(null!);

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
  
  async pushThreadAnswerToMessage(answer: Message): Promise<void> {
    const selectedChannel = this.selectedChannel$.value;
    const thread_subject = this.thread_subject$.value;
  
    if (selectedChannel && thread_subject) {
      answer.timestamp = formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en-US');
      await addDoc(this.getChannelsMessageColRef(selectedChannel, thread_subject), answer.toJSON());
    } else {
      console.error('No selected channel or thread subject available.');
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

  async pushMessageToChannel(message: Message): Promise<void> {
    const selectedChannel = this.selectedChannel$.value;
    message.timestamp = formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en-US');
    //try and catch besser ??
    if (selectedChannel) {
      await addDoc(this.getChannelsColRef(selectedChannel), message.toJSON());
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

  getChannelsColRef(selectedChannel: Channel) {
    return collection(this.firestore, `channels/${selectedChannel.id}/messages`);
  }

  getChannelsMessageColRef(selectedChannel: Channel, thread_subject: Message) {
    return collection(this.firestore, `channels/${selectedChannel.id}/messages/${thread_subject.id}/answers`);
  }

  getSingleDocRef(coldId: string, docID: string) {
    return doc(collection(this.firestore, coldId), docID)
  }

  ngOnDestroy() {
    this.unsubChannels();
  }
}
