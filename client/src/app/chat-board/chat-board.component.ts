import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../shared/service/chat.service';

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
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
  selectedFile: ImageSnippet;
  file: any;
  constructor(private chat: ChatService) { }

  ngOnInit() {
    this.formatMessage();

    this.chat.getMessage().subscribe(msg => {
      if (msg) {
        console.log(msg);
        this.pushMessage(msg);
      }
    });
  }

  pushMessage(msg) {
    if (msg.action === 'sender' && msg.message_id && msg.success && msg.success === '1') {
      // const chat = this.chatbox.find((t) => t.sender === msg.sdr_rcv).find((t) => t.id === msg.id );
      this.chatbox.forEach(sender => {
        const chat = sender.listMessage.find((t) => t.id === msg.message_id);
        if (chat) {
          chat.status = 'success';
        }
      });

    } else {
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
  }

  getMessages(item) {
    this.selectedFile = null;
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
    if (message || this.selectedFile) {
      if (this.inputVal){
        this.inputVal.nativeElement.value = '';
      }
      const type = this.selectedFile ? 'image' : 'text';
      const fd = new FormData();
      if (type === 'image') {
        fd.append('file', this.selectedFile.file);
      }
      this.chat.sendMessage(message, this.activatedSender, type, fd).subscribe((data: any) => {
        this.selectedFile = null;
        this.pushMessage({
          sdr_rcv: this.activatedSender, message, date: new Date().toISOString().split('T'),
          id: data[0].message_id, from_me: true, status: 'pending', type, path: data[0].path || ''
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
      if (json) {
        json = json.reverse();
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
      }
    });

  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });

    reader.readAsDataURL(file);
  }



}
