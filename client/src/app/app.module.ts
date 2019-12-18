import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { SharedModule } from './shared/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { DefaultComponent } from './shared/component/default/default.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ChatBoardComponent } from './chat-board/chat-board.component';
import { FieldErrorMessageComponent } from './shared/component/field-error-message/field-error-message.component';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DefaultComponent,
    ChatBoardComponent,
    FieldErrorMessageComponent
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
