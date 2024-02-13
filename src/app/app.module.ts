import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/enviroment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { DialogShowProfileComponent } from './dialogs/dialog-show-profile/dialog-show-profile.component';
import { DialogEditProfileComponent } from './dialogs/dialog-edit-profile/dialog-edit-profile.component';
import { DialogCreateChannelComponent } from './dialogs/dialog-create-channel/dialog-create-channel.component';
import { DialogEditChannelComponent } from './dialogs/dialog-edit-channel/dialog-edit-channel.component';
import { DialogDummyComponent } from './dialogs/dialog-dummy/dialog-dummy.component';
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
import { DialogAddChannelmembersComponent } from './dialogs/dialog-add-channelmembers/dialog-add-channelmembers.component';
import { MainContentDirectmessageChatComponent } from './main-content/main-content-directmessage-chat/main-content-directmessage-chat.component';
import { MainContentDirectmessageChatUpperPartComponent } from './main-content/main-content-directmessage-chat/main-content-directmessage-chat-upper-part/main-content-directmessage-chat-upper-part.component';
import { MainContentDirectmessageChatLowerPartComponent } from './main-content/main-content-directmessage-chat/main-content-directmessage-chat-lower-part/main-content-directmessage-chat-lower-part.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DialogShowChannelmembersComponent } from './dialogs/dialog-show-channelmembers/dialog-show-channelmembers.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ImprintComponent } from './imprint/imprint.component';

import { AuthService } from './shared-services/authentication.service';
import { ChannelsService } from './shared-services/channels.service';
import { DataService } from './shared-services/data.service';
import { OpenDialogService } from './shared-services/open-dialog.service';
import { UserService } from './shared-services/user.service';
import { CommonService } from './shared-services/common.service';
import { StorageService } from './shared-services/storage.service';
import { MainContentNewMessageComponent } from './main-content/main-content-new-message/main-content-new-message.component';
import { MainContentWorkspaceHeaderComponent } from './main-content/main-content-workspace-header/main-content-workspace-header.component';
import { DialogShowWelcomeMessageComponent } from './dialogs/dialog-show-welcome-message/dialog-show-welcome-message.component';


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
    MainContentDirectmessageChatComponent,
    MainContentDirectmessageChatUpperPartComponent,
    MainContentDirectmessageChatLowerPartComponent,
    DialogShowChannelmembersComponent,
    ResetPasswordComponent,
    EmailVerificationComponent,
    PrivacyPolicyComponent,
    ImprintComponent,
    MainContentNewMessageComponent,
    MainContentWorkspaceHeaderComponent,
    DialogShowWelcomeMessageComponent,
  ],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserModule,
    FormsModule,
    AppRoutingModule,
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
    MatRadioModule,
    PickerComponent,
    MatProgressSpinnerModule
  ],
  providers: [
    OpenDialogService,
    AuthService,
    ChannelsService,
    UserService,
    DataService,
    CommonService,
    StorageService,
  ],
  bootstrap: [AppComponent,
  ]
})
export class AppModule { }
