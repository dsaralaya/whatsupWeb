import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './shared/component/default/default.component';
import { LoginComponent } from './login/login.component';
import { ChatBoardComponent } from './chat-board/chat-board.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }, {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'login'
    }
  },
  {
    path: 'chat',
    component: ChatBoardComponent,
    data: {
      title: 'chat'
    }
  }, {
    path: '',
    component: DefaultComponent,
    data: {
      title: ''
    },
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
