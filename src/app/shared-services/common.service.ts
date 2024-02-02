import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private router: Router, public storageService: StorageService) { }

  isPasswordMatching(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  changeInputPasswordToTxt(event: MouseEvent): void {
    let imgElement = event.target as HTMLImageElement;
    let parentElement = imgElement.parentElement;
    let inputElement = parentElement?.querySelector('input') as HTMLInputElement;

    if (inputElement) {
      inputElement.type = inputElement.type === 'password' ? 'text' : 'password';
      imgElement.src = inputElement.type === 'password' ? 'assets/icons/visibility_off.svg' : 'assets/icons/visibility.svg';
    }
  }

  showPopup(popup_name:string) {
    const popup = document.getElementById(popup_name);
    const popup_Background = document.getElementById(popup_name + "-bg");
    if (popup && popup_Background) {
      popup_Background.classList.remove('d-none');
      popup.classList.remove('d-none');
      popup.classList.add('animate-in'); 
    };    
  }

  showVerifyPopup(popup_name:string) {
    const popup = document.getElementById(popup_name);
    if (popup) {
      popup.classList.remove('d-none');
      popup.classList.add('animate-in'); 
    };    
    setTimeout(() => {
      if (popup) {
        popup.classList.add('d-none');
      }
    }, 2000);
  }

  routeTo(router_link: string , seconds: number) {
    setTimeout(() => {
      this.router.navigate([`/${router_link}`]);
    }, seconds);
  }

  triggerFileInput(inputId: string) {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    if (fileInput) {
        fileInput.click();
    } 
  }

  downloadImage(imageUrl: string) {
    const link = document.createElement('a');
    link.href = imageUrl; // Verwendet die URL des Bildes aus dem Parameter
    link.download = 'DownloadedImage';
    link.target = "_blank";
    link.click();
  }

  async handleFileInput(event: Event): Promise<string | null> {
    const fileInput = event.target as HTMLInputElement | null;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      try {
        const uploadedUrl = await this.storageService.uploadFile(file);
        return uploadedUrl;
      } catch (error) {
        console.error('Fehler beim Hochladen der Datei', error);
        return null;
      }
    }
    return null;
  }
  

  checkFileSize(input: HTMLInputElement) {
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileType = file.type;
      const MAX_FILE_SIZE = 5242880;
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      return validTypes.includes(fileType) && file.size < MAX_FILE_SIZE;
    } else {
      return false;
    }
  }

 
}
