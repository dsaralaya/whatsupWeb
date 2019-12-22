import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { User } from '../model/user';
import { map } from 'rxjs/operators';
import { configuation } from './../config';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    endpoint = `${configuation.serverURL}`;
    public currentUser: Observable<User>;
    private currentUserSubject: BehaviorSubject<User>;

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get token(): string {
        return this.currentUserSubject.value.access_token;
    }

    public get name(): string {
        return this.currentUserSubject.value.name;
    }

    login(request) {
        const header = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.http.post<any>(`${this.endpoint}/login/add`, request, { headers: header })
            .pipe(map(res => {
                // login successful if there's a jwt token in the response
                if (res.statusCode === '200') {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(res.data));
                    this.currentUserSubject.next(res.data);
                    return res;
                } else {
                    return [];
                }

            }),
            );
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }
}
