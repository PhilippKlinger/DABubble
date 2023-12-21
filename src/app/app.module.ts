import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp({ "projectId": "dabubble-5ec88", "appId": "1:540601189295:web:7f3ece8c1beefd7ba9655a", "storageBucket": "dabubble-5ec88.appspot.com", "apiKey": "AIzaSyBwQtoQFZ1UWiUgbOSwrfARsckBgdqZjXA", "authDomain": "dabubble-5ec88.firebaseapp.com", "messagingSenderId": "540601189295" })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
