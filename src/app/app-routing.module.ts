import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DialogDummyComponent } from './dialogs/dialog-dummy/dialog-dummy.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: AppComponent },      //nur platzhalter
  { path: 'login', component: LoginComponent },
  { path: 'dialogs', component: DialogDummyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
