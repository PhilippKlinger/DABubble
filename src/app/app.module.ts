import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DialogShowProfileComponent } from './dialogs/dialog-show-profile/dialog-show-profile.component';
import { DialogEditProfileComponent } from './dialogs/dialog-edit-profile/dialog-edit-profile.component';
import { DialogCreateChannelComponent } from './dialogs/dialog-create-channel/dialog-create-channel.component';
import { DialogEditChannelComponent } from './dialogs/dialog-edit-channel/dialog-edit-channel.component';
import { DialogDummyComponent } from './dialogs/dialog-dummy/dialog-dummy.component';
import { OpenDialogService } from './shared-services/open-dialog.service';
import { DialogMenuProfileComponent } from './dialogs/dialog-menu-profile/dialog-menu-profile.component';
import { MainContentComponent } from './main-content/main-content.component';
import { MainContentSearchbarComponent } from './main-content/main-content-searchbar/main-content-searchbar.component';
import { MainContentMainChatComponent } from './main-content/main-content-main-chat/main-content-main-chat.component';
import { LoginComponent } from './login/login.component';
import { MainContentMainChatUpperPartComponent } from './main-content/main-content-main-chat/main-content-main-chat-upper-part/main-content-main-chat-upper-part.component';
import { MainContentMainChatLowerPartComponent } from './main-content/main-content-main-chat/main-content-main-chat-lower-part/main-content-main-chat-lower-part.component';
import { MainContentLogoComponent } from './main-content/main-content-logo/main-content-logo.component';
import { MainContentProfileSelectorComponent } from './main-content/main-content-profile-selector/main-content-profile-selector.component';
import { MainContentThreadChatComponent } from './main-content/main-content-thread-chat/main-content-thread-chat.component';
import { MainContentThreadChatLowerPartComponent } from './main-content/main-content-thread-chat/main-content-thread-chat-lower-part/main-content-thread-chat-lower-part.component';
import { MainContentThreadChatUpperPartComponent } from './main-content/main-content-thread-chat/main-content-thread-chat-upper-part/main-content-thread-chat-upper-part.component';
import { MainContentSideBarComponent } from './main-content/main-content-side-bar/main-content-side-bar.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { firebaseConfig } from '../environments/firebase.config';
import { DialogAddChannelmembersComponent } from './dialogs/dialog-add-channelmembers/dialog-add-channelmembers.component';


@NgModule({
  declarations: [
    AppComponent,
    DialogCreateChannelComponent,
    DialogShowProfileComponent,
    DialogEditProfileComponent,
    DialogEditChannelComponent,
    DialogDummyComponent,
    DialogMenuProfileComponent,
    MainContentComponent,
    MainContentSearchbarComponent,
    MainContentMainChatComponent,
    LoginComponent,
    MainContentMainChatUpperPartComponent,
    MainContentMainChatLowerPartComponent,
    MainContentLogoComponent,
    MainContentProfileSelectorComponent,
    MainContentThreadChatComponent,
    MainContentThreadChatLowerPartComponent,
    MainContentThreadChatUpperPartComponent,
    MainContentSideBarComponent,
    DialogAddChannelmembersComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp({ "projectId": "dabubble-5ec88", "appId": "1:540601189295:web:7f3ece8c1beefd7ba9655a", "storageBucket": "dabubble-5ec88.appspot.com", "apiKey": "AIzaSyBwQtoQFZ1UWiUgbOSwrfARsckBgdqZjXA", "authDomain": "dabubble-5ec88.firebaseapp.com", "messagingSenderId": "540601189295" })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    MatRadioModule

  ],
  providers: [OpenDialogService,
  ],
  bootstrap: [AppComponent,
  ]
})
export class AppModule { }
