import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DialogDummyComponent } from './dialogs/dialog-dummy/dialog-dummy.component';
import { AppComponent } from './app.component';
import { MainContentComponent } from './main-content/main-content.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: AppComponent },      //nur platzhalter
  { path: 'login', component: LoginComponent },
  { path: 'dialogs', component: DialogDummyComponent },
  { path: 'main-content', component: MainContentComponent },
  { path: 'reset-password', component: MainContentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
