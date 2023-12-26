import { Injectable } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Channel } from '../models/channel.class';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChannelsService {

  private channelsSubject = new BehaviorSubject<Channel[]>([]);
  channels$ = this.channelsSubject.asObservable();

  private unsubChannels;

  constructor(private firestore: Firestore) {
    this.unsubChannels = this.subChannelsList();
  }

  async createChannel(item: Channel, colId: "channels"): Promise<string> {
    const collectionRef = collection(this.firestore, colId);
    const docRef = await addDoc(collectionRef, item).catch(error => {
      console.error(error);
      throw error;
    });

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
      console.log(channels);
    });
  }

  getChannelsRef() {
    return collection(this.firestore, 'channels');
  }

  ngOnDestroy() {
    this.unsubChannels();
  }
}
