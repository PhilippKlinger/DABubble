import { Injectable } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, updateDoc, deleteDoc, setDoc, query, where, getDocs, getDoc, addDoc, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/message.class';
import { formatDate } from '@angular/common';
import { ChannelsService } from './channels.service';
import { DMInfo } from '../models/DMInfo.class';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  dm_info = new DMInfo();

  public users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public selectedUserforProfileView$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public dm_user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  private unsubUsers;

  constructor(private firestore: Firestore, private channelService: ChannelsService) {
    this.unsubUsers = this.subUsersList();
  }


  async findConversation(dm_user: User, currentUserInfo: User): Promise<{ DMInfo: DMInfo | null, available: boolean, docId: string }> {
    const querySnapshot = await getDocs(query(this.getUsersDMRef(dm_user), where('chatPartnerId', '==', currentUserInfo.id)));

    let dm_info_result: DMInfo | null = null;
    let available = false;
    let docId: string = '';

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dm_info_result = data as DMInfo;
      available = true;
      docId = doc.id
    });

    const result = {
      'DMInfo': dm_info_result,
      'available': available,
      'docId': docId,
    };

    return result;
  }

  async pushMessageToUser(message: Message): Promise<void> {
    const dm_user = this.dm_user$.value;
    const currentUserInfo = this.channelService.currentUserInfo$.value

    message.timestamp = formatDate(new Date(), 'dd-MM-yyyy HH:mm:ss', 'en-US');
    message.setCreatorId(currentUserInfo.id);

    if (dm_user && currentUserInfo && ((await this.findConversation(dm_user, currentUserInfo)).available)) {

      let docRef = await addDoc(this.getUsersDMConversationRef(dm_user, ((await this.findConversation(dm_user, currentUserInfo)).docId)), message.toJSON());
      message.setId(docRef.id);
      await updateDoc(this.getUpdatedUsersDMConversationRef(dm_user, ((await this.findConversation(dm_user, currentUserInfo)).docId), docRef.id), message.toJSON())

      docRef = await addDoc(this.getUsersDMConversationRef(currentUserInfo, ((await this.findConversation(currentUserInfo, dm_user)).docId)), message.toJSON());
      message.setId(docRef.id);
      await updateDoc(this.getUpdatedUsersDMConversationRef(currentUserInfo, ((await this.findConversation(currentUserInfo, dm_user)).docId), docRef.id), message.toJSON())

      console.log('unterhaltung bereits verfügbar, Nachricht wurde gesendet');
    } else if (dm_user && currentUserInfo && (!(await this.findConversation(dm_user, currentUserInfo)).available)) {

      this.dm_info.setChatPartner(currentUserInfo?.name!);
      this.dm_info.setChatPartnerId(currentUserInfo?.id!);
      let docRef = await addDoc(this.getUsersDMRef(dm_user), this.dm_info.toJSON());
      this.dm_info.setDocId(docRef.id);
      await updateDoc(this.getUpdatedUsersDMRef(dm_user, docRef.id), this.dm_info.toJSON());
      docRef = await addDoc(this.getUsersDMConversationRef(dm_user, ((await this.findConversation(dm_user, currentUserInfo)).docId)), message.toJSON());
      message.setId(docRef.id);
      await updateDoc(this.getUpdatedUsersDMConversationRef(dm_user, ((await this.findConversation(dm_user, currentUserInfo)).docId), docRef.id), message.toJSON())


      this.dm_info.setChatPartner(dm_user?.name!);
      this.dm_info.setChatPartnerId(dm_user?.id!);
      docRef = await addDoc(this.getUsersDMRef(currentUserInfo), this.dm_info.toJSON());
      this.dm_info.setDocId(docRef.id);
      await updateDoc(this.getUpdatedUsersDMRef(currentUserInfo, docRef.id), this.dm_info.toJSON());
      docRef = await addDoc(this.getUsersDMConversationRef(currentUserInfo, ((await this.findConversation(currentUserInfo, dm_user)).docId)), message.toJSON());
      message.setId(docRef.id);
      await updateDoc(this.getUpdatedUsersDMConversationRef(currentUserInfo, ((await this.findConversation(currentUserInfo, dm_user)).docId), docRef.id), message.toJSON())

      console.log('unterhaltung wurde erstellt, Nachricht wurde gesendet');
    } else {
      console.log('kein direct messages user verfügbar');
    }

    this.dm_user$.next(dm_user);
  }

  async createUser(user: User, colId: "users"): Promise<void> {
    let docRef = doc(this.firestore, colId, user.id);
    try {
      await setDoc(docRef, user.toJSON());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  subUsersList() {
    return onSnapshot(this.getUsersRef(), (querySnapshot) => {
      let users = querySnapshot.docs.map((doc) => {
        let data = doc.data() as User;
        return new User({ ...data, id: doc.id });
      });
      this.users$.next(users);
    });
  }

  async deleteUser(colId: string, docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (error) => {
        console.error(error)
      }
    )
  }

  async updateUser(user: User | null) {
    if (user && user.id) {
      let docRef = this.getSingleDocRef('users', user.id);
      await updateDoc(docRef, user.toJSON()).catch(
        (err) => {
          console.log(err);
        }
      );
    }
  }

  getUsersRef() {
    return collection(this.firestore, 'users');
  }

  getUsersDMRef(dm_user: User) {
    return collection(this.firestore, `users/${dm_user.id}/directmessages`);
  }

  getUsersDMInfoRef(dm_user: User, id: string) {
    return collection(this.firestore, `users/${dm_user.id}/directmessages/${id}`);
  }

  getUsersDMConversationRef(dm_user: User, userId: string) {
    return collection(this.firestore, `users/${dm_user.id}/directmessages/${userId}/messages`);
  }

  getUpdatedUsersDMConversationRef(dm_user: User, userId: string, messageId: string) {
    return doc(this.firestore, `users/${dm_user.id}/directmessages/${userId}/messages/${messageId}`);
  }

  getUpdatedUsersDMRef(dm_user: User, id: string) {
    return doc(this.firestore, `users/${dm_user.id}/directmessages/${id}`);
  }

  getSingleDocRef(coldId: string, docID: string) {
    return doc(collection(this.firestore, coldId), docID)
  }

  ngOnDestroy() {
    this.unsubUsers();
  }

  async setUserOnlineStatus(userId: string, onlineStatus: boolean): Promise<void> {
    let docRef = this.getSingleDocRef('users', userId);
    await updateDoc(docRef, { onlineStatus }).catch((error) => {
      console.error(error);
    });
  }

  setSelectedUser(user: User): void {
    this.selectedUserforProfileView$.next(user);
  }

  async userExistsByEmail(email: string): Promise<boolean> {
    const q = query(this.getUsersRef(), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  async getUserInfos(userId: string): Promise<any> {
    const userDocRef = doc(this.firestore, 'users', userId);
    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzerinformationen:', error);
      throw error;
    }
  }
}