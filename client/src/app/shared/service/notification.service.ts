import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Notification, NotificationType } from '../model/notification';

@Injectable({ providedIn: 'root' })
export class NotificationService {

    private subject = new Subject<Notification>();
    private idx = 0;
    getObservable(): Observable<Notification> {
        return this.subject.asObservable();
    }



    info(title, message: string, timeout = 5000) {
        this.subject.next(new Notification(this.idx++, NotificationType.info, title, message, timeout));
    }

    success(title, message: string, timeout = 5000) {
        this.subject.next(new Notification(this.idx++, NotificationType.success, title, message, timeout));
    }

    warning(title, message: string, timeout = 5000) {
        this.subject.next(new Notification(this.idx++, NotificationType.warning, title, message, timeout));
    }

    error(title, message, timeout = 5000) {
        this.subject.next(new Notification(this.idx++, NotificationType.error, title, message, timeout));
    }

}
