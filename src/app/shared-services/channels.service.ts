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

  private channelsSubject = new BehaviorSubject<Channel[]>([]);
  channels$ = this.channelsSubject.asObservable();
  private selectedChannelSubject = new BehaviorSubject<Channel | null>(null);
  selectedChannel$ = this.selectedChannelSubject.asObservable();
  private unsubChannels;

  constructor(private firestore: Firestore) {
    this.unsubChannels = this.subChannelsList();
  }

  setSelectedChannel(channel: Channel): void {
    this.selectedChannelSubject.next(channel);
  }
  
  async pushMessageToChannel(message: Message): Promise<void> {
    const selectedChannel = this.selectedChannelSubject.value;
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
      // Später rausschmeißen
      console.log('Channel written with ID: ', docRef.id);
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
      this.channelsSubject.next(channels);
      //später rausschmeißen
      console.log(channels);
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

  getSingleDocRef(coldId: string, docID: string) {
    return doc(collection(this.firestore, coldId), docID)
  }

  ngOnDestroy() {
    this.unsubChannels();
  }
}
