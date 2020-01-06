import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BotMenuComponent } from './bot-menu/bot-menu.component';
import { SettingsComponent } from './settings/settings.component';
import { ContactComponent } from './contacts/contacts.component';


const routes: Routes = [{
    path: 'register',
    component: RegisterComponent

},{
    path: 'dashboard',
    component: DashboardComponent

},{
    path: 'botmenu',
    component: BotMenuComponent

},{
    path: 'settings',
    component: SettingsComponent
}, {
    path: 'contacts',
    component: ContactComponent

}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule {


}

