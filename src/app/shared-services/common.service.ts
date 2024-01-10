import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

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
}
