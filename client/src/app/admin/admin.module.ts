import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminRoutingModule } from './admin.routing';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../shared/shared.module';
import { BotMenuComponent } from './bot-menu/bot-menu.component';
import { ButtonRendererComponent } from '../shared/component/button-renderer.component';
import { SettingsComponent } from './settings/settings.component';



@NgModule({
  declarations: [
    RegisterComponent,
    DashboardComponent,
    BotMenuComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule, AdminRoutingModule, AgGridModule.withComponents([ButtonRendererComponent]), SharedModule
  ]
})
export class AdminModule { }
