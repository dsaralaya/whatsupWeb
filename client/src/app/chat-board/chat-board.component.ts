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
  page=0;
  isLoad=true;
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
      const sid = msg.sender;
      if (this.chatbox && this.chatbox.length > 0) {
        const sender = this.chatbox.find((t) => t.sender == sid);
        if (sender) {
          if (!sender.listMessage) {
            sender.listMessage = [];
          }
          if (!sender.listMessage.find((t) => t.message_id === msg.message_id)){
            sender.listMessage.push(msg);
            if (sender.sender !== this.activatedSender) {
              if (sender.count) {
                sender.count += 1;
              } else {
                sender.count = 1;
              }
            }
          }
        
        } else {
          this.chatbox.push({ sender: sid, img: `/assets/images/user-icons/man-${Math.floor((Math.random() * 6))}.png`,
          count:1, listMessage: [msg ] });
        }
      } else {
        this.chatbox.push({ sender: sid, listMessage: [msg] , 
          img: `/assets/images/user-icons/man-${Math.floor((Math.random() * 6))}.png`});
      }
    }
  }

  getMessages(item) {
    this.selectedFile = null;
    this.page=0;
    this.isLoad=true;
    this.activatedSender = item.sender;
    this.activatedSenderImg = item.img;
    if (this.chatbox && this.chatbox.length > 0) {
      const sender = this.chatbox.find((t) => t.sender === item.sender);
      if (sender) {
        this.messageList = [];
        sender.count=0;
        this.messageList = sender.listMessage;
      }
    }
  }
  checkDate(list,index,date){
    if(index!=0){
      return list.slice(0, index).find((t) => t.date.split(' ')[0] === date.split(' ')[0]);
    }
    return false;
  }

  sendMessage(message) {
    if (message || this.selectedFile) {
      if (this.inputVal) {
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

  loadMore() {
    this.page +=1;
    this.chat.loadMoreMessage(this.activatedSender, this.page).subscribe((data: any) => {
       if (data && data.length>0) {
         const sender = this.chatbox.find((t) => t.sender === this.activatedSender);
         if (sender) {
           data = data.reverse();
           data.forEach(d => {
             sender.listMessage.unshift(d);
           });

         }
       } else {
         this.isLoad=false;
       }
    });
  }

  




}
