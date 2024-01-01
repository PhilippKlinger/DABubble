import { Injectable } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, DocumentData, getDoc } from '@angular/fire/firestore';
import { Channel } from '../models/channel.class';
import { BehaviorSubject } from 'rxjs';
import { formatDate } from '@angular/common';

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

  async createChannel(channel: Channel, colId: "channels"): Promise<string> {
    const collectionRef = collection(this.firestore, colId);
    channel.timestamp = formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en-US')
    const docRef = await addDoc(collectionRef, channel.toJSON()).catch(error => {
      console.error(error);
      throw error;
    });
    //später rausschmeißen
    console.log('Channel written with ID: ', docRef.id);
    return docRef.id;
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

  getSingleDocRef(coldId: string, docID: string) {
    return doc(collection(this.firestore, coldId), docID)
  }

  ngOnDestroy() {
    this.unsubChannels();
  }
}
