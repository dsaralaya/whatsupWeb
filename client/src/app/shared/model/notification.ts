export class Notification {

    constructor(
        public id: number,
        public type: string,
        public title: string,
        public message: string,
        public timeout: number,
    ) { }

}
export enum NotificationType {
    success = 'success',
    warning = 'warning',
    error = 'danger',
    info = 'info'
}
