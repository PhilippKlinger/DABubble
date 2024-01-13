import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private router: Router) { }

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
    if (popup) {
      popup.classList.remove('d-none');
      popup.classList.add('animate-in'); 
    };    
  }

  routeTo(router_link: string) {
    setTimeout(() => {
      this.router.navigate([`/${router_link}`]);
    }, 2000);
  }
}
