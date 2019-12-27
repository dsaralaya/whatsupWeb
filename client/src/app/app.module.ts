import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { DefaultComponent } from './shared/component/default/default.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ChatBoardComponent } from './chat-board/chat-board.component';
import { configuation } from './shared/config';


const config: SocketIoConfig = { url: configuation.url, options: {} };
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DefaultComponent,
    ChatBoardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
