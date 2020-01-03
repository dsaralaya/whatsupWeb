import { Component, OnInit } from '@angular/core';
import { CrudeService } from 'src/app/shared/service/crud.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  cred = {};
  connected = false;
  constructor(private crudeService: CrudeService) { }

  ngOnInit() {
    this.getDeviceStatus();
  }

  getDeviceStatus() {
    // tslint:disable-next-line: max-line-length
    const params = 'device/status';
    this.crudeService.get(params).subscribe(res => {
      if (res.device.status === 'active') {
        this.connected = true;
      }
    });
  }

}
