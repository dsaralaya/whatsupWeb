import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminRoutingModule } from './admin.routing';



@NgModule({
  declarations: [
    RegisterComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule, AdminRoutingModule
  ]
})
export class AdminModule { }
