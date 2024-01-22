import { Injectable } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, updateDoc, deleteDoc, setDoc, query, where, getDocs, getDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  public users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public selectedUserforProfileView$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);


  private unsubUsers;

  constructor(private firestore: Firestore) {
    this.unsubUsers = this.subUsersList();
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