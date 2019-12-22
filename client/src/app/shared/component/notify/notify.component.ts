import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../service/notification.service';
import { Notification } from '../../model/notification';
@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnDestroy, OnInit {
  notifications: Notification[] = [];
  private subscription: Subscription;

  constructor(private notificationSvc: NotificationService) { }

  ngOnInit() {
    this.subscription = this.notificationSvc.getObservable().subscribe(notification => this._addNotification(notification));
  }

  private _addNotification(notification: Notification) {
    this.notifications.push(notification);

    if (notification.timeout !== 0) {
      setTimeout(() => this.close(notification), notification.timeout);

    }
  }

  close(notification: Notification) {
    this.notifications = this.notifications.filter(notif => notif.id !== notification.id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
