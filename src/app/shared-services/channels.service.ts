import { Injectable } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, getDocs } from '@angular/fire/firestore';
import { Channel } from '../models/channel.class';
import { BehaviorSubject } from 'rxjs';
import { formatDate } from '@angular/common';
import { Message } from '../models/message.class';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {
 
  private initialChannelSet = false;


  public channels$: BehaviorSubject<Channel[]> = new BehaviorSubject<Channel[]>([]);
  public selectedChannel$: BehaviorSubject<Channel | null> = new BehaviorSubject<Channel | null>(null);
  public currentUserInfo$: BehaviorSubject<User> = new BehaviorSubject<User>(null!);

  private unsubChannels;

  constructor(private firestore: Firestore) {
    this.unsubChannels = this.subChannelsList();
    console.log(this.currentUserInfo$)
  }

  setSelectedChannel(channel: Channel): void {
    this.selectedChannel$.next(channel);
  }

  isCurrentUserChannelMember(channel: Channel): boolean {
    const currentUser = this.currentUserInfo$.value;
    return channel.members.some(member => member.id === currentUser.id);
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

      // if (!this.initialChannelSet && channels.length > 0) {
      //   this.initialChannelSet = true;
      //   const currentUser = this.currentUserInfo$.value;
      //   const firstMemberChannel = channels.find(channel => 
      //     channel.members.some(member => member.id === currentUser.id)
      //   );

      //   if (firstMemberChannel) {
      //     this.setSelectedChannel(firstMemberChannel);
      //   } else {
      //     console.log("Sie sind in keinem Channel Mitglied.");
      //   }
      // }
      this.channels$.next(channels);
    });

  }

  // setInitialChannelSelection() {

  // }

  resetInitialChannelSelection() {
    this.initialChannelSet = false;
  }

  async updateUserNameInMessages(userId: string, newName: string) {
    const channels = this.channels$.value;
    for (const channel of channels) {
      const messagesRef = this.getChannelsColRef(channel);
      const querySnapshot = await getDocs(messagesRef);
      querySnapshot.forEach(async (doc) => {
        const message = doc.data() as Message;
        if (message.creatorId === userId) {
          const updatedMessage = { ...message, creatorName: newName };
          await updateDoc(doc.ref, updatedMessage);
        }
      });
    }
  }

  async deleteChannel(channel: Channel | null) {
    if (channel && channel.id) {
      const docRef = this.getSingleDocRef('channels', channel.id);
      await deleteDoc(docRef).catch((error) => {
        console.error(error);
      });
    }
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

  async refreshChannelsList() {
    const querySnapshot = await getDocs(this.getChannelsRef());
    const channels = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Channel;
      return new Channel({ ...data, id: doc.id });
    });
    this.channels$.next(channels);
  }

  getChannelsRef() {
    return collection(this.firestore, 'channels');
  }

  getUpdatedChannelsColRef(selectedChannel: Channel, id: string) {
    return doc(this.firestore, `channels/${selectedChannel.id}/messages/${id}`);
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
