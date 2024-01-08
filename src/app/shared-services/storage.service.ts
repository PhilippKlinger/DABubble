import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = getStorage();

  constructor() { }

  async uploadFile(file: File): Promise<string> {    
    const timestamp = new Date().getTime();
    const uniqueFileName = `${timestamp}-${file.name}`;
    const storageRef = ref(this.storage, `user_avatars/${uniqueFileName}`);
    try {
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    } catch (error) {
      console.error('Fehler beim Hochladen der Datei:', error);
      throw new Error('Fehler beim Hochladen der Datei');
    }
  }
}