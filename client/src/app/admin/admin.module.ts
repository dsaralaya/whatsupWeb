import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminRoutingModule } from './admin.routing';
import { AgGridModule } from 'ag-grid-angular';
import { FieldErrorMessageComponent } from '../shared/component/field-error-message/field-error-message.component';



@NgModule({
  declarations: [
    RegisterComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule, AdminRoutingModule, AgGridModule.withComponents([])
  ]
})
export class AdminModule { }
