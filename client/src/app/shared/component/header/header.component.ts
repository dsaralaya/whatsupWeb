import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUserName = '';
  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.currentUserName = this.authService.name;
  }

  logout() {
    this.authService.logout();
  }

}
