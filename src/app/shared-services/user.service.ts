import { Injectable } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, updateDoc, deleteDoc, setDoc, query, where, getDocs, getDoc, addDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/message.class';
import { formatDate } from '@angular/common';
import { ChannelsService } from './channels.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  public users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public selectedUserforProfileView$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public dm_user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  private unsubUsers;

  constructor(private firestore: Firestore, private channelService: ChannelsService) {
    this.unsubUsers = this.subUsersList();
  }

  async pushMessageToUser(message: Message): Promise<void> {
    const dm_user = this.dm_user$.value;
    const currentUserInfo = this.channelService.currentUserInfo$.value

    message.timestamp = formatDate(new Date(), 'dd-MM-yyyy HH:mm:ss', 'en-US');
    //try and catch besser ??
    if (dm_user) {
      message.setId(currentUserInfo.id);
      const docRef = await addDoc(this.getUsersDMRef(dm_user), message.toJSON());

      message.setId(docRef.id);

      await updateDoc(this.getUpdatedUsersDMRef(dm_user, currentUserInfo.id), message.toJSON());

      // console.log(docRef.id)
    } else {
      console.error('No direct message of this user available.');
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