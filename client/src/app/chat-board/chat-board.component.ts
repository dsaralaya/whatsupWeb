import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../shared/service/chat.service';
import { AuthenticationService } from '../shared/service/auth.service';
import { Router } from '@angular/router';
import { CrudeService } from '../shared/service/crud.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  page = 0;
  isLoad = true;
  senderList = [];
  showBackButton = false;
  showEmojiPicker=false;
  entoggle=false;

  constructor(private chat: ChatService, private authService: AuthenticationService,
              private router: Router, private crudeService: CrudeService, private sanitizer: DomSanitizer) {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.role === 'Admin') {
      this.showBackButton = true;
    }
    if (currentUser === null) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.crudeService.getBy(`chathistory/show`, `${this.authService.currentUserValue.id}`).subscribe((resp: any) => {
      console.log(resp.data);
      if (resp.data) {
        this.senderList = resp.data.map((item) => {
          return item.senderId;
        });
      }
      this.formatMessage(this.senderList);
    });
    this.chat.redirectUser().subscribe(d => {
      console.log('icoming message');
      if (d && this.authService.currentUserValue.id === d.user_id) {
        this.senderList.push(d.msg.senderId);
        d.msg.id = d.msg.message_id;
        this.pushMessage(d.msg);
        this.scroll();
        const audio = new Audio('/assets/sound/notification.mp3');
        const playPromise = audio.play();
        if (playPromise !== null) {
          playPromise.catch(() => { audio.play(); });
        }
      
      }
    });
    this.chat.getMessage().subscribe(msg => {
      if (msg) {
        if (msg.action === 'sender') {
          this.pushMessage(msg);
        } else {
          if (this.senderList.find((t) => t === msg.sender)) {
            this.pushMessage(msg);
          }
        }
        this.scroll();
      }
    });
  }
  scroll() {
    setTimeout(() => {
      const elem = document.getElementById('messages');
      elem.scrollTop = elem.scrollHeight;
    }, 200);
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
          // if (!sender.listMessage.find((t) => t.message_id === msg.message_id)) {
          sender.listMessage.push(msg);
          if (sender.sender !== this.activatedSender) {
            if (sender.count) {
              sender.count += 1;
            } else {
              sender.count = 1;
            }
          }
          // }

        } else {
          this.chatbox.push({
            sender: sid, img: `/assets/images/user-icons/man-${Math.floor((Math.random() * 6))}.png`,
            count: 1, listMessage: [msg]
          });
          if (this.chatbox.length === 1) {
            this.getMessages(this.chatbox[0]);
          }
          this.scroll();
        }
      } else {
        this.chatbox.push({
          sender: sid, listMessage: [msg],
          img: `/assets/images/user-icons/man-${Math.floor((Math.random() * 6))}.png`
        });
        if (this.chatbox.length === 1) {
          this.getMessages(this.chatbox[0]);
        }
      }
    }
  }

  getMessages(item) {
    if (item) {
      this.crudeService.getBy(`chat/getall`, item.sender).subscribe((json: any) => {
        this.selectedFile = null;
        this.page = 0;
        this.isLoad = true;
        this.activatedSender = item.sender;
        this.activatedSenderImg = item.img;
        if (this.chatbox && this.chatbox.length > 0) {
          const sender = this.chatbox.find((t) => t.sender === item.sender);
          if (sender) {
            this.messageList = [];
            sender.count = 0;
            sender.listMessage = json.reverse();
            this.messageList = sender.listMessage;
            this.loadImages(this.messageList);
            setTimeout(() => {
              const elem = document.getElementById('messages');
              elem.scrollTop = elem.scrollHeight;
            }, 100);
          }
        }
      });
    }
  }
  loadImages(list) {
    const imgarray = list.filter((t) => t.type === 'image');
    if (imgarray.length > 0) {
      const arr = imgarray.map((item) => {
        return item.id;
      });
      const arrStr = encodeURIComponent(JSON.stringify(arr));
      this.crudeService.getBy(`imagehistory/get`, arrStr).subscribe((data) => {
        if (data) {
          data.forEach(element => {
            const img = list.find((t) => t.id === element.messageId);
            img.path = this.sanitizer.bypassSecurityTrustResourceUrl(element.image);
          });
        }
      });
    }
  }

  checkDate(list, index, date) {
    if (index != 0) {
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
        if (Object.prototype.toString.call(data).indexOf('Array') > -1) {
          data = data[0];
        }
        this.pushMessage({
          sender: this.activatedSender, message, date: new Date().toISOString().replace('T', ' ').split('.')[0],
          id: data.message_id, from_me: true, status: 'pending', type, path: this.sanitizer.bypassSecurityTrustResourceUrl(data.path) || ''
        });
        this.scroll();
      });
    }
  }

  formatMessage(sender) {
    this.chatbox = [];
    sender.forEach(element => {
      this.chatbox.push({
        img: `/assets/images/user-icons/man-${Math.floor((Math.random() * 6))}.png`,
        sender: element, listMessage: []
      });
    });
    this.getMessages(this.chatbox[0]);
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
    this.page += 1;
    this.chat.loadMoreMessage(this.activatedSender, this.page).subscribe((data: any) => {
      if (data && data.length > 0) {
        const sender = this.chatbox.find((t) => t.sender === this.activatedSender);
        if (sender) {
          // data = data.reverse();
          data.forEach(d => {
            sender.listMessage.unshift(d);
          });
          this.loadImages(sender.listMessage);


        }
      } else {
        this.isLoad = false;
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  endChat() {
    this.crudeService.update(`chathistory/endchat`, this.activatedSender, {}).subscribe((resp: any) => {
      this.senderList = this.senderList.filter((t) => t != this.activatedSender);
      this.chatbox = this.chatbox.filter((t) => t.sender != this.activatedSender);
      if (this.chatbox.length > 0) {
        this.getMessages(this.chatbox[0]);
      } else {
        this.messageList = [];
        this.activatedSender = '';
      }
    });
  }

  back() {
    this.router.navigate(['/admin/dashboard']);
  }

  transferChat() {
    const role =this.authService.currentUserValue.role.toLowerCase() === 'support' ? 'Sales' : 'Support';
    const message = this.messageList[this.messageList.length - 1];
    message.senderId = this.activatedSender;
    message.sender = this.activatedSender;
    message.message_id = message.id;
    this.crudeService.create(`chat/transfer`, { sender: this.activatedSender, role, msg: message}).subscribe((resp: any) => {
      this.senderList = this.senderList.filter((t) => t !== this.activatedSender);
      this.chatbox = this.chatbox.filter((t) => t.sender !== this.activatedSender);
      if (this.chatbox.length > 0) {
        this.getMessages(this.chatbox[0]);
      } else {
        this.messageList = [];
        this.activatedSender = '';
      }
    });
  }

 


   toggleEmojiPicker() {
        this.showEmojiPicker = !this.showEmojiPicker;
      }

  addEmoji(event) {
        const text = `${event.emoji.native}`;
        this.inputVal.nativeElement.value += text;
        this.showEmojiPicker = false;
      }


}
