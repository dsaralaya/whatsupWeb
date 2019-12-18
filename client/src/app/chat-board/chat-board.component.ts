import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../shared/service/chat.service';

@Component({
  selector: 'app-chat-board',
  templateUrl: './chat-board.component.html',
  styleUrls: ['./chat-board.component.scss']
})
export class ChatBoardComponent implements OnInit {
  @ViewChild('inputVal', { static: false }) inputVal;
  chatbox: any;
  messageList = [];
  activatedSender = '';
  activatedSenderImg = '';
  toggle = false;
  constructor(private chat: ChatService) { }

  ngOnInit() {
    this.formatMessage();

    this.chat.getMessage().subscribe(msg => {
      if (msg) {
        this.pushMessage(msg);
      }
    });
  }

  pushMessage(msg) {
    const sid = msg.sdr_rcv;
    if (this.chatbox && this.chatbox.length > 0) {
      const sender = this.chatbox.find((t) => t.sender == sid);
      if (sender) {
        if (!sender.listMessage) {
          sender.listMessage = [];
        }
        sender.listMessage.push(msg);
      }
    } else {
      this.chatbox.push({ sender: sid, listMessage: [{ msg }] });
    }
  }

  getMessages(item) {
    this.activatedSender = item.sender;
    this.activatedSenderImg = item.img;
    if (this.chatbox && this.chatbox.length > 0) {
      const sender = this.chatbox.find((t) => t.sender === item.sender);
      if (sender) {
        this.messageList = [];
        this.messageList = sender.listMessage;
      }
    }
  }

  sendMessage(message) {
    if (message) {
      this.inputVal.nativeElement.value = '';
      this.chat.sendMessage(message, this.activatedSender).subscribe((data: any) => {
        this.pushMessage({
          sdr_rcv: this.activatedSender, message, date: new Date().toISOString().split('T'),
          id: data.message_id, from_me: true, status: 'success'
        });
        setTimeout(() => {
          const elem = document.getElementById('messages');
          elem.scrollTop = elem.scrollHeight;
        }, 100);
      });
    }
  }

  formatMessage() {
    this.chatbox = [];
    this.chat.getAllMessage().subscribe((json: any) => {

      json = json.sort((a, b) => {
        // tslint:disable-next-line: no-angle-bracket-type-assertion
        return <any>new Date(a.date) - <any>new Date(b.date);
      });
      console.log(json);
      json.forEach(element => {
        const sender = this.chatbox.find((t) => t.sender == element.sdr_rcv);
        if (sender) {
          if (!sender.listMessage) {
            sender.listMessage = [];
          }
          sender.listMessage.push(element);
        } else {
          // tslint:disable-next-line: max-line-length
          this.chatbox.push({ img: `/assets/images/user-icons/man-${Math.floor((Math.random() * 6))}.png`, sender: element.sdr_rcv, listMessage: [element] });
        }
      });
      this.getMessages(this.chatbox[0]);
    });



  }



}
