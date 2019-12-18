import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket, private http: HttpClient) { }


  sendMessage(msg: string, sender: string) {
   // return  this.socket.emit('message', { message: msg, sender: sender});
    return this.http.post('http://localhost:3000/api/chat/send',  { message: msg, sender });
  }

  getMessage() {
    return this.socket
      .fromEvent<any>('message');
  }

  getAllMessage() {
    return this.http.get('http://localhost:3000/api/chat/getall');
  }
}
