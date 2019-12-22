import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminRoutingModule } from './admin.routing';
import { AgGridModule } from 'ag-grid-angular';
import { FieldErrorMessageComponent } from '../shared/component/field-error-message/field-error-message.component';
import { SharedModule } from '../shared/shared.module';
import { BotMenuComponent } from './bot-menu/bot-menu.component';



@NgModule({
  declarations: [
    RegisterComponent,
    DashboardComponent,
    BotMenuComponent
  ],
  imports: [
    CommonModule, AdminRoutingModule, AgGridModule.withComponents([]), SharedModule
  ]
})
export class AdminModule { }
