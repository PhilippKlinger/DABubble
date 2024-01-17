import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DialogDummyComponent } from './dialogs/dialog-dummy/dialog-dummy.component';
import { MainContentComponent } from './main-content/main-content.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dialogs', component: DialogDummyComponent },
  { path: 'main-content', component: MainContentComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'verify-email', component: EmailVerificationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
