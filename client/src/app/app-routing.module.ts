import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './shared/component/default/default.component';
import { LoginComponent } from './login/login.component';
import { ChatBoardComponent } from './chat-board/chat-board.component';
// import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { RoleGuardService as RoleGuard } from './shared/service/role-guard.service';
import { roleAccess } from './shared/config';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login'
    }
  },
  {
    path: 'chat',
    component: ChatBoardComponent,
    data: {
      title: 'Chat'
    }
  },
  {
    path: '',
    component: DefaultComponent,
    canActivate: [RoleGuard],
    data: {
      title: '',
      expectedRole: roleAccess.AdminLogin
    },
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.module').then(m => m.AdminModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
