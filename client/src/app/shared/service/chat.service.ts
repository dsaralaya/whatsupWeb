import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { configuation } from '../../shared/config';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  serverURL = configuation.serverURL;
  constructor(private socket: Socket, private http: HttpClient) { }


  sendMessage(msg: string, sender: string, type, fd: FormData) {
    // return  this.socket.emit('message', { message: msg, sender: sender});
    if (type === 'text') {
      return this.http.post(`${this.serverURL}/chat/send`, { message: msg, sender, type });
    }
    fd.append('message', msg);
    fd.append('recipient', sender);
    fd.append('type', 'image');
    return this.http.post(`${this.serverURL}/chat/send`, fd);
  }

  getMessage() {
    return this.socket
      .fromEvent<any>('message');
  }

  redirectUser() {
    return this.socket
      .fromEvent<any>('switch');
  }

  getAllMessage(sender) {
    return this.http.get(`${this.serverURL}/chat/getall?id=${sender}`);
  }

  loadMoreMessage(sender, page) {
    return this.http.post(`${this.serverURL}/chat/load_more`, { sdr_rcv: sender, page });
  }
}
