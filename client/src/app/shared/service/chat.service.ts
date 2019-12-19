import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
   serverURL ='http://localhost:3000';
  constructor(private socket: Socket, private http: HttpClient) { }


  sendMessage(msg: string, sender: string, type, fd: FormData) {
   // return  this.socket.emit('message', { message: msg, sender: sender});
    if (type === 'text') {
      return this.http.post(`${this.serverURL}/api/chat/send`, { message: msg, sender, type });
    }
    fd.append('message', msg);
    fd.append('recipient', sender);
    fd.append('type', 'image');
    return this.http.post(`${this.serverURL}/api/chat/send`,  fd );
  }

  getMessage() {
    return this.socket
      .fromEvent<any>('message');
  }

  getAllMessage() {
    return this.http.get(`${this.serverURL}/api/chat/getall`);
  }

  loadMoreMessage(sender,page) {
    return this.http.post(`${this.serverURL}/api/chat/load_more`, { sdr_rcv: sender, page});
  }
}
