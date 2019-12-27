import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../service/auth.service';
import { CrudeService } from '../../service/crud.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUserName = '';
  constructor(private authService: AuthenticationService, private crudService: CrudeService) { }

  ngOnInit() {
    this.currentUserName = this.authService.name;
  }

  logout() {
    this.authService.currentUserValue['status'] = 'Inactive';
    this.crudService.update('register/update', this.authService.currentUserValue.id, this.authService.currentUserValue).subscribe((updateRes: any) => {
      this.authService.logout();
    });
  }

}
